const User = require("../models/user")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

exports.register = async (req, res, next) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 10)

  const user = new User({
    full_name: req.body.full_name,
    email: req.body.email,
    password: hashedPassword,
  })

  await user.save()

  next()
}

exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).exec()
  if (!user) {
    return res.status(404).json({ error: "Incorrect email or password" })
  }
  const match = bcrypt.compareSync(req.body.password, user.password)
  if (!match) {
    return res.status(400).json({ error: "Incorrect email or password" })
  }
  const SECRET = process.env.SECRET
  const payload = {
    id: user._id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
  }
  const token = jwt.sign(payload, SECRET)
  res.json({ message: "Login successful", payload, token })
}
