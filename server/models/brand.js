const mongoose = require("mongoose")

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String },
})

module.exports = mongoose.model("Brand", brandSchema)
