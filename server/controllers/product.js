const { convert } = require("url-slug")
const { body, validationResult } = require("express-validator")
const multer = require("multer")
const Product = require("../models/product")
const Category = require("../models/category")
const Brand = require("../models/brand")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
})

const upload = multer({ storage: storage })

const create_slug = async (req, res, next) => {
  const { name, id } = req.body
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
    exists = await Product.exists({ _id: { $ne: id }, slug: slug }).exec()
    i++
  }

  if (i === MAX_TRIES) {
    return res.status(500).json({ error: "Tried generating slug too many times" })
  }

  req.body.slug = slug
  next()
}

exports.product_list = async (req, res) => {
  const { sort } = req.query

  const query = Product.find().populate("category")

  switch (sort) {
    case "price_asc":
      query.sort({ price: 1 })
      break
    case "price_desc":
      query.sort({ price: -1 })
      break
    case "popular":
      query.sort({ view_count: -1 })
      break
    default:
      query.sort({ created_at: -1 })
  }

  const products = await query.exec()
  res.json(products)
}

exports.product_create = [
  upload.single("image"),
  create_slug,
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Name must be between 3 and 200 characters")
    .escape(),
  body("price").notEmpty().withMessage("Price is required").isNumeric().withMessage("Price must be a number").escape(),
  body("description")
    .isLength({ min: 3, max: 1000 })
    .withMessage("Description must be between 3 and 1000 characters")
    .escape()
    .optional({ values: "falsy" }),
  body("category")
    .optional({ values: "falsy" })
    .custom(async (value) => {
      const category = await Category.findById(value)
      if (!category) {
        throw new Error("Invalid category")
      }
    })
    .escape(),
  body("brand")
    .optional({ values: "falsy" })
    .custom(async (value) => {
      const brand = await Brand.findById(value)
      if (!brand) {
        throw new Error("Invalid brand")
      }
    })
    .escape(),
  body("sizes.*").notEmpty().withMessage("Size is required").escape(),
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
      image: req.file ? req.file.path : null,
      category: req.body.category,
      brand: req.body.brand,
      sizes: req.body.sizes && req.body.sizes.length ? req.body.sizes : null,
    })
    await product.save()
    res.json(product)
  },
]

exports.product_detail = async (req, res) => {
  const { slug } = req.params
  const product = await Product.findOne({ slug: slug }).populate("category").populate("brand")
  if (!product) {
    return res.status(404).json({ error: "Product not found" })
  }

  // increment product view count
  Product.findOneAndUpdate({ slug: slug }, { $inc: { view_count: 1 } }).exec()

  res.json(product)
}

exports.product_update = [
  upload.single("image"),
  create_slug,
  body("name")
    .optional()
    .isLength({ min: 3, max: 200 })
    .withMessage("Name must be between 3 and 200 characters")
    .escape(),
  body("price").optional().isNumeric().withMessage("Price must be a number").escape(),
  body("description")
    .optional({ values: "falsy" })
    .isLength({ min: 3, max: 1000 })
    .withMessage("Description must be between 3 and 1000 characters")
    .escape(),
  body("category")
    .optional({ values: "falsy" })
    .custom(async (value) => {
      const category = await Category.findById(value)
      if (!category) {
        throw new Error("Invalid category")
      }
    })
    .escape(),
  body("brand")
    .optional({ values: "falsy" })
    .custom(async (value) => {
      const brand = await Brand.findById(value)
      if (!brand) {
        throw new Error("Invalid brand")
      }
    })
    .escape(),
  body("sizes.*").notEmpty().withMessage("Size is required").escape(),
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
        image: req.body.image || (req.file ? req.file.path : null),
        category: req.body.category,
        brand: req.body.brand,
        sizes: req.body.sizes.length ? req.body.sizes : null,
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
