const User = require("../models/user")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { body, validationResult } = require("express-validator")

exports.register = [
  body("full_name")
    .notEmpty()
    .withMessage("Full name is required")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Full name must contain only letters"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email format is invalid")
    .custom(async (value) => {
      // check if email already exists
      const exists = await User.exists({ email: value }).exec()
      if (exists) {
        throw new Error("Email is already used")
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() })
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10)

    const user = new User({
      full_name: req.body.full_name,
      email: req.body.email,
      password: hashedPassword,
    })

    await user.save()

    next()
  },
]

exports.login = [
  body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Email format is invalid"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() })
    }

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
  },
]
