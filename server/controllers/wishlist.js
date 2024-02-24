const ProductVariant = require("../models/productVariant")

exports.wishlist_get = async (req, res) => {
  const { wishlistId } = req.params
  const items = await ProductVariant.find({ in_wishlist: wishlistId }).populate("product").exec()
  res.json(items)
}

exports.wishlist_item_create = async (req, res, next) => {
  const { wishlistId } = req.params

  // prevent adding same product twice
  const inWishlist = await ProductVariant.findOne({ product: req.body.product._id, in_wishlist: wishlistId }).exec()
  if (inWishlist) {
    return res.status(400).json({ error: "Product is already in wishlist" })
  }

  const sku = req.body.product.slug + "_" + req.body.size
  const item = new ProductVariant({
    sku: sku,
    product: req.body.product,
    size: req.body.size,
    quantity: req.body.quantity,
    in_wishlist: wishlistId,
  })

  await item.save()

  next()
}

exports.wishlist_item_update = async (req, res, next) => {
  const { itemId } = req.params
  const updatedItem = await ProductVariant.findByIdAndUpdate(
    itemId,
    { size: req.body.size, quantity: req.body.quantity || 1 },
    { new: true }
  ).exec()

  if (!updatedItem) {
    return res.status(404).json({ error: "Item not found" })
  }

  next()
}

exports.wishlist_item_delete = async (req, res, next) => {
  const { itemId } = req.params
  const deletedItem = await ProductVariant.findByIdAndDelete(itemId).exec()

  if (!deletedItem) {
    return res.status(404).json({ error: "Item not found" })
  }

  next()
}
