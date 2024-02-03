const { convert } = require("url-slug")
const { body, validationResult } = require("express-validator")
const multer = require("multer")
const Category = require("../models/category")
const Product = require("../models/product")

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
    exists = await Category.exists({ _id: { $ne: id }, slug: slug }).exec()
    i++
  }

  if (i === MAX_TRIES) {
    return res.status(500).json({ error: "Tried generating slug too many times" })
  }

  req.body.slug = slug
  next()
}

exports.category_list = async (req, res) => {
  const { limit } = req.query

  const query = Category.find().sort({ name: 1 })

  if (limit) {
    query.limit(limit)
  }

  const categories = await query.lean()

  const categoryPromises = categories.map(async (category) => {
    const nbOfProducts = await Product.countDocuments({ category: category }).exec()
    category.nb_of_products = nbOfProducts
    return category
  })

  const categoriesWithNbOfProducts = await Promise.all(categoryPromises)

  res.json(categoriesWithNbOfProducts)
}

exports.category_create = [
  upload.single("image"),
  create_slug,
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Name must be between 3 and 200 characters")
    .escape(),
  body("description")
    .isLength({ min: 3, max: 200 })
    .withMessage("Description must be between 3 and 200 characters")
    .escape()
    .optional({ values: "falsy" }),
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.mapped() })
    }

    const category = new Category({
      name: req.body.name,
      slug: req.body.slug,
      description: req.body.description,
      image: req.file ? req.file.path : null,
    })
    await category.save()
    res.json(category)
  },
]

exports.category_detail = async (req, res) => {
  const { slug } = req.params
  const { sort } = req.query

  const category = await Category.findOne({ slug: slug }).lean()
  if (!category) {
    return res.status(404).json({ error: "Category not found" })
  }

  const productQuery = Product.find({ category: category })

  switch (sort) {
    case "price_asc":
      productQuery.sort({ price: 1 })
      break
    case "price_desc":
      productQuery.sort({ price: -1 })
      break
    case "popular":
      productQuery.sort({ view_count: -1 })
      break
    default:
      productQuery.sort({ created_at: -1 })
  }

  category.products = await productQuery.exec()
  res.json(category)
}

exports.category_update = [
  upload.single("image"),
  create_slug,
  body("name")
    .optional()
    .isLength({ min: 3, max: 200 })
    .withMessage("Name must be between 3 and 200 characters")
    .escape(),
  body("description")
    .isLength({ min: 3, max: 200 })
    .withMessage("Description must be between 3 and 200 characters")
    .escape()
    .optional({ values: "falsy" }),
  async (req, res) => {
    const { slug } = req.params
    const updatedCategory = await Category.findOneAndUpdate(
      { slug: slug },
      {
        name: req.body.name,
        slug: req.body.slug,
        description: req.body.description,
        image: req.body.image || (req.file ? req.file.path : null),
      },
      { new: true }
    )
    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" })
    }
    res.json(updatedCategory)
  },
]

exports.category_delete = async (req, res) => {
  const { slug } = req.params
  const deletedCategory = await Category.findOneAndDelete({ slug: slug })
  if (!deletedCategory) {
    return res.status(404).json({ error: "Category not found" })
  }
  res.json(deletedCategory)
}
