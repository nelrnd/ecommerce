const Cart = require("../models/cart")
const ProductVariant = require("../models/productVariant")
const { body, validationResult } = require("express-validator")

const MAX_ITEM_QUANTITY = 5

exports.cart_get = async (req, res) => {
  const { cartId } = req.params
  const items = await ProductVariant.find({ in_cart: cartId }).populate("product").exec()
  res.json(items)
}

exports.cart_create = async (req, res) => {
  const cart = new Cart({
    user: req.body.user_id,
  })
  await cart.save()
  res.json(cart)
}

exports.cart_delete = async (req, res) => {
  const { cartId } = req.params
  const deletedCart = await Cart.findByIdAndDelete(cartId).exec()
  if (!deletedCart) {
    return res.status(404).json({ error: "Cart not found" })
  }
  res.json(deletedCart)
}

exports.cart_merge = async (req, res, next) => {
  const { cartId } = req.params // user cart
  const { currentCartId } = req.body

  const items = await ProductVariant.find({ in_cart: currentCartId }).exec()

  await Promise.all(
    items.map(async (item) => {
      const itemInUserCart = await ProductVariant.findOne({ in_cart: cartId, sku: item.sku }).exec()
      if (itemInUserCart) {
        item.quantity = Math.min(MAX_ITEM_QUANTITY, item.quantity + itemInUserCart.quantity)
        await ProductVariant.findByIdAndDelete(itemInUserCart._id).exec()
      }
      item.in_cart = cartId
      await item.save()
      return item
    })
  )

  await Cart.findByIdAndDelete(currentCartId).exec()

  next()
}

exports.cart_item_create = async (req, res, next) => {
  const { cartId } = req.params
  const { product, quantity, size } = req.body
  const sku = product.slug + "_" + size

  const itemInCart = await ProductVariant.findOne({ in_cart: cartId, sku: sku }).exec()

  if (product.sizes && !size) {
    return res.status(400).json({ error: "Size is required" })
  }

  if (itemInCart) {
    if (itemInCart.quantity < MAX_ITEM_QUANTITY) {
      itemInCart.quantity++
      await itemInCart.save()
    }
  } else {
    const item = new ProductVariant({
      sku: sku,
      product: product._id,
      quantity: quantity,
      size: size,
      in_cart: cartId,
    })
    await item.save()
  }

  next()
}

exports.cart_item_update = [
  body("quantity")
    .isNumeric()
    .withMessage("Quantity must be a number")
    .isInt({ max: MAX_ITEM_QUANTITY })
    .withMessage(`Maximum quantity per item is ${MAX_ITEM_QUANTITY}`)
    .optional(),
  async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.json(errors.array())
    }

    const { cartId, itemId } = req.params

    const newSku = req.body.slug + "_" + req.body.size

    const itemInCart = await ProductVariant.findOne({ _id: { $ne: itemId }, in_cart: cartId, sku: newSku }).exec()

    if (itemInCart) {
      itemInCart.quantity = Math.min(MAX_ITEM_QUANTITY, itemInCart.quantity + req.body.quantity)
      await itemInCart.save()
      await ProductVariant.findByIdAndDelete(itemId).exec()
    } else {
      const updatedItem = await ProductVariant.findByIdAndUpdate(
        itemId,
        {
          sku: newSku,
          quantity: req.body.quantity,
          size: req.body.size,
        },
        { new: true }
      ).exec()
      if (!updatedItem) {
        return res.status(404).json({ error: "Item not found" })
      }
    }

    next()
  },
]

exports.cart_item_delete = async (req, res, next) => {
  const { itemId } = req.params
  const deletedItem = await ProductVariant.findByIdAndDelete(itemId).exec()
  if (!deletedItem) {
    return res.status(404).json({ error: "Item not found" })
  }
  next()
}

exports.cart_clear = async (req, res, next) => {
  const { cartId } = req.params
  await ProductVariant.deleteMany({ in_cart: cartId }).exec()
  next()
}
