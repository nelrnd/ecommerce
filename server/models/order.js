const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  country: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String },
  zip_code: { type: String, required: true },
  phone_code: { type: String, required: true },
  phone: { type: Number, required: true },
  shipping_method: { type: String, required: true },
  products: [
    {
      product: { type: mongoose.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      size: { type: String },
    },
  ],
})

module.exports = mongoose.model("Order", orderSchema)
