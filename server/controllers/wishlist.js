const ProductVariant = require("../models/productVariant")

exports.wishlist_get = async (req, res) => {
  const { wishlistId } = req.params
  const items = await ProductVariant.find({ in_wishlist: wishlistId }).exec()
  res.json(items)
}

exports.wishlist_item_create = async (req, res, next) => {
  const item = new ProductVariant({
    product: req.body.product,
    size: req.body.size,
    quantity: req.body.quantity,
  })

  await item.save()

  next()
}

exports.wishlist_item_update = async (req, res, next) => {
  const { itemId } = req.params
  const updatedItem = await ProductVariant.findByIdAndUpdate(
    itemId,
    { size: req.body.size, quantity: req.body.quantity },
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
