const Cart = require("../models/cart")
const ProductVariant = require("../models/productVariant")

const MAX_ITEM_QUANTITY = 5

exports.cart_create = async (req, res) => {
  const cart = new Cart({
    user: req.body.user_id,
  })

  await cart.save()

  res.json(cart)
}

exports.cart_create_item = async (req, res) => {
  const { cartId } = req.params

  const product = req.body.product
  const sku = product.name + product.size

  const itemInCart = await ProductVariant.findOne({ cart: cartId, sku: sku }).exec()
  if (itemInCart && itemInCart.quantity < MAX_ITEM_QUANTITY) {
    itemInCart.quantity++
    await itemInCart.save()
  }

  if (!itemInCart) {
    const item = new ProductVariant({
      sku: sku,
      product: req.body.product._id,
      size: req.body.size,
      quantity: req.body.quantity,
      in_cart: cartId,
    })

    await item.save()
  }

  const items = await ProductVariant.find({ cart: cartId }).exec()
  res.json(items)
}

exports.cart_delete = async (req, res) => {
  const deletedCart = await Cart.findByIdAndDelete(req.body.cart_id).exec()

  if (!deletedCart) {
    return res.status(404).json({ error: "Cart not found" })
  }

  res.json(deletedCart)
}
