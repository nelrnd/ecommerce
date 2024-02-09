const Order = require("../models/order")
const { body, validationResult } = require("express-validator")

exports.order_list = async (req, res) => {
  const orders = await Order.find().populate("products.product").exec()
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
    .isString()
    .withMessage("Country must be a string")
    .isLength({ min: 2, max: 50 })
    .withMessage("Country must be between 2 and 50 characters long")
    .escape(),
  body("address")
    .notEmpty()
    .withMessage("Address is required")
    .isString()
    .withMessage("Address must be a string")
    .isLength({ min: 2, max: 200 })
    .withMessage("Address must be between 2 and 200 characters long")
    .escape(),
  body("city")
    .notEmpty()
    .withMessage("City is required")
    .isString()
    .withMessage("City must be a string")
    .isLength({ min: 2, max: 50 })
    .withMessage("City must be between 2 and 50 characters long")
    .escape(),
  body("state").isString().withMessage("State must be a string").optional().escape(),
  body("zip_code")
    .notEmpty()
    .withMessage("Zip/postal code is required")
    .isString()
    .withMessage("Zip/postal code must be a string")
    .isLength({ min: 2, max: 50 })
    .withMessage("Country must be between 2 and 50 characters long")
    .escape(),
  body("phone_code")
    .notEmpty()
    .withMessage("Country calling code is required")
    .isString()
    .withMessage("Country calling code must be a string")
    .isLength({ min: 0, max: 999 })
    .withMessage("Country calling code must be between 0 and 999")
    .escape(),
  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isString()
    .withMessage("Phone number must be a string")
    .escape(),
  body("shipping_method")
    .notEmpty()
    .withMessage("Shipping method is required")
    .isString()
    .withMessage("Shipping method must be a string")
    .escape(),
  body("products").isArray().notEmpty().withMessage("Order cannot be empty"),
  body("products.*.quantity")
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

    await order.populate("products.product")

    res.json(order)
  },
]

exports.order_detail = async (req, res) => {
  const { id } = req.params
  const order = await Order.findById(id).populate("products.product").exec()
  if (!order) {
    return res.status(404).json({ error: "Order not found" })
  }
  res.json(order)
}
