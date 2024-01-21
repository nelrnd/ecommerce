const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String },
  image: { type: String },
})

module.exports = mongoose.model("Category", categorySchema)
