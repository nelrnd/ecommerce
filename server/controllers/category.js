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
  const categories = await Category.find()
  res.json(categories)
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
  const category = await Category.findOne({ slug: slug })
  if (!category) {
    return res.status(404).json({ error: "Category not found" })
  }
  const categoryProducts = await Product.find({ category: category })
  res.json({ category, category_products: categoryProducts })
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
