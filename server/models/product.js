const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
  sizes: { type: [String], default: undefined },
  created_at: { type: Date, default: Date.now },
  view_count: { type: Number, default: () => Math.floor(Math.random() * 10) },
})

productSchema.index({ name: "text" })

module.exports = mongoose.model("Product", productSchema)
