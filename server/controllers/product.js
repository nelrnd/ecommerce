const { convert } = require("url-slug")
const { body, validationResult } = require("express-validator")
const Product = require("../models/product")

const create_slug = async (req, res, next) => {
  const name = req.body.name
  if (!name) {
    return next()
  }
  let slug = ""
  let exists = true
  const MAX_TRIES = 10
  let i = 0

  while (exists && i < MAX_TRIES) {
    slug = convert(name)
    if (i > 0) {
      slug += "-" + i
    }
    exists = await Product.exists({ slug: slug }).exec()
    i++
  }

  if (i === MAX_TRIES) {
    return res
      .status(500)
      .json({ error: "Tried generating slug too many times" })
  }

  req.body.slug = slug
  next()
}

exports.product_list = async (req, res) => {
  const products = await Product.find()
  res.json(products)
}

exports.product_create = [
  create_slug,
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Name must be between 3 and 200 characters")
    .escape(),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number")
    .escape(),
  body("description")
    .optional()
    .isLength({ min: 3, max: 1000 })
    .withMessage("Description must be between 3 and 1000 characters")
    .escape(),
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.mapped() })
    }

    const product = new Product({
      name: req.body.name,
      slug: req.body.slug,
      price: req.body.price,
      description: req.body.description,
    })
    await product.save()
    res.json(product)
  },
]

exports.product_detail = async (req, res) => {
  const { slug } = req.params
  const product = await Product.findOne({ slug: slug })
  if (!product) {
    return res.status(404).json({ error: "Product not found" })
  }
  res.json(product)
}

exports.product_update = [
  create_slug,
  body("name")
    .optional()
    .isLength({ min: 3, max: 200 })
    .withMessage("Name must be between 3 and 200 characters")
    .escape(),
  body("price")
    .optional()
    .isNumeric()
    .withMessage("Price must be a number")
    .escape(),
  body("description")
    .optional()
    .isLength({ min: 3, max: 1000 })
    .withMessage("Description must be between 3 and 1000 characters")
    .escape(),
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.mapped() })
    }

    const { slug } = req.params
    const updatedProduct = await Product.findOneAndUpdate(
      { slug: slug },
      {
        name: req.body.name,
        slug: req.body.slug,
        price: req.body.price,
        description: req.body.description,
      },
      { new: true }
    )
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" })
    }
    res.json(updatedProduct)
  },
]

exports.product_delete = async (req, res) => {
  const { slug } = req.params
  const deletedProduct = await Product.findOneAndDelete({ slug: slug })
  if (!deletedProduct) {
    return res.status(404).json({ error: "Product not found" })
  }
  res.json(deletedProduct)
}
