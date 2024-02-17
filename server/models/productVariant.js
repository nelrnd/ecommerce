const mongoose = require("mongoose")

const productVariantSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  size: { type: String },
  quantity: { type: Number, required: true },
  in_cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart", required: true },
})

module.exports = mongoose.model("ProductVariant", productVariantSchema)
