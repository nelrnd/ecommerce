const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  sizes: { type: [String], default: null },
})

module.exports = mongoose.model("Product", productSchema)
