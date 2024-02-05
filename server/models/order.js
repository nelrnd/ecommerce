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
  created_at: { type: Date, default: Date.now },
  products: [
    {
      product: { type: mongoose.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      size: { type: String },
    },
  ],
})

orderSchema.pre("save", async function (next) {
  const count = await Order.countDocuments()
  this.number = 10000 + count + 1
  next()
})

const Order = mongoose.model("Order", orderSchema)

module.exports = Order
