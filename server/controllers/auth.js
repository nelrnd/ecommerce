const User = require("../models/user")
const jwt = require("jsonwebtoken")

exports.register = async (req, res, next) => {
  const user = new User({
    full_name: req.body.full_name,
    email: req.body.email,
    password: req.body.password,
  })

  await user.save()

  next()
}

exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).exec()
  if (!user) {
    return res.status(400).json({ error: "Incorrect email or password" })
  }
  const match = user.password === req.body.password
  if (!match) {
    return res.status(400).json({ error: "Incorrect email or password" })
  }
  console.log(user)
  const SECRET = process.env.SECRET
  const payload = {
    full_name: user.full_name,
    email: user.email,
    role: user.role,
  }
  const token = jwt.sign(payload, SECRET)
  res.json({ message: "Login successful", payload, token })
}
