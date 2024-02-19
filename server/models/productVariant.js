const mongoose = require("mongoose")

const productVariantSchema = new mongoose.Schema({
  sku: { type: String, required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  size: { type: String },
  quantity: { type: Number, required: true },
  in_cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
  in_wishlist: { type: mongoose.Schema.Types.ObjectId, ref: "Wishlist" },
})

module.exports = mongoose.model("ProductVariant", productVariantSchema)
