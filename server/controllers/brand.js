const Brand = require("../models/brand")
const Product = require("../models/product")
const { convert } = require("url-slug")
const { body, validationResult } = require("express-validator")

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
    exists = await Brand.exists({ _id: { $ne: id }, slug: slug }).exec()
    i++
  }

  if (i === MAX_TRIES) {
    return res.status(500).json({ error: "Tried generating slug too many times" })
  }

  req.body.slug = slug
  next()
}

exports.brand_list = async (req, res) => {
  const brands = await Brand.find().sort({ name: 1 }).lean()

  const brandPromises = brands.map(async (brand) => {
    const nbOfProducts = await Product.countDocuments({ brand: brand }).exec()
    brand.nb_of_products = nbOfProducts
    return brand
  })

  const brandsWithNbOfProducts = await Promise.all(brandPromises)

  res.json(brandsWithNbOfProducts)
}

exports.brand_create = [
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

    const brand = new Brand({
      name: req.body.name,
      slug: req.body.slug,
      description: req.body.description,
    })
    await brand.save()
    res.json(brand)
  },
]

exports.brand_detail = async (req, res) => {
  const { slug } = req.params
  const brand = await Brand.findOne({ slug: slug })
  if (!brand) {
    return res.status(404).json({ error: "Brand not found" })
  }
  const brandProducts = await Product.find({ brand: brand })
  res.json({ brand, brand_products: brandProducts })
}

exports.brand_update = [
  create_slug,
  body("name")
    .optional()
    .isLength({ min: 3, max: 200 })
    .withMessage("Name must be between 3 and 200 characters")
    .escape(),
  body("description")
    .isLength({ min: 3, max: 1000 })
    .withMessage("Description must be between 3 and 1000 characters")
    .escape()
    .optional({ values: "falsy" }),
  async (req, res) => {
    const { slug } = req.params
    const updatedBrand = await Brand.findOneAndUpdate(
      { slug: slug },
      {
        name: req.body.name,
        slug: req.body.slug,
        description: req.body.description,
      },
      { new: true }
    )
    if (!updatedBrand) {
      return res.status(404).json({ error: "Brand not found" })
    }
    res.json(updatedBrand)
  },
]

exports.brand_delete = async (req, res) => {
  const { slug } = req.params
  const deletedBrand = await Brand.findOneAndDelete({ slug: slug })
  if (!deletedBrand) {
    return res.status(404).json({ error: "Brand not found" })
  }
  res.json(deletedBrand)
}
