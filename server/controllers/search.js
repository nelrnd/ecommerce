const Product = require("../models/product")

exports.search_get = async (req, res) => {
  const { term, limit, sort } = req.query

  if (term === "") {
    return res.json([])
  }

  const query = Product.aggregate([{ $match: { name: { $regex: term, $options: "i" } } }])

  if (limit) {
    query.limit(Number(limit))
  }

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

  const results = await query.exec()

  res.json(results)
}
