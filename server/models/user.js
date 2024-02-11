const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
  full_name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["client", "admin"], default: "client" },
})

module.exports = mongoose.model("User", userSchema)
