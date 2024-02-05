const Order = require("../models/order")
const { body, validationResult } = require("express-validator")

exports.order_list = async (req, res) => {
  const orders = await Order.find().exec()
  return res.json(orders)
}

exports.order_create = [
  body("first_name")
    .notEmpty()
    .withMessage("First name is required")
    .isString()
    .withMessage("First name must be a string")
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 5 characters long")
    .escape(),
  body("last_name")
    .notEmpty()
    .withMessage("Last name is required")
    .isString()
    .withMessage("Last name must be a string")
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters long")
    .escape(),
  body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Email format is invalid").escape(),
  body("country")
    .notEmpty()
    .withMessage("Country is required ")
    .isLength({ min: 2, max: 50 })
    .withMessage("Country must be between 2 and 50 characters long")
    .escape(),
  body("address")
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Address must be between 2 and 50 characters long")
    .escape(),
  body("city")
    .notEmpty()
    .withMessage("City is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("City must be between 2 and 50 characters long")
    .escape(),
  body("state").optional().escape(),
  body("zip_code")
    .notEmpty()
    .withMessage("Zip/postal code is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Country must be between 2 and 50 characters long")
    .escape(),
  body("phone_code")
    .notEmpty()
    .withMessage("Country calling code is required")
    .isNumeric()
    .withMessage("Phone code must be a number")
    .isFloat({ min: 1, max: 900 })
    .withMessage("Country calling code must between 1 and 900")
    .escape(),
  body("phone").notEmpty().withMessage("Phone number is required").escape(),
  body("shipping_method").notEmpty().withMessage("Shipping method is required").escape(),
  body("products").isArray().notEmpty().withMessage("Order cannot be empty"),
  body("products.quantity")
    .notEmpty()
    .withMessage("Product quantity must be specified")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors })
    }

    const order = new Order({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      country: req.body.country,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      zip_code: req.body.zip_code,
      phone_code: req.body.phone_code,
      phone: req.body.phone,
      shipping_method: req.body.shipping_method,
      products: req.body.products,
    })
    await order.save()
    res.json(order)
  },
]

exports.order_detail = async (req, res) => {
  const { id } = req.params
  const order = await Order.findById(id).exec()
  if (!order) {
    return res.status(404).json({ error: "Order not found" })
  }
  res.json(order)
}
