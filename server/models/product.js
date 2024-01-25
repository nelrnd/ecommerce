const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  sizes: [
    {
      size: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      _id: false,
    },
  ],
})

module.exports = mongoose.model("Product", productSchema)
