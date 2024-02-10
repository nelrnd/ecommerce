const Product = require("../models/product")

exports.search_get = async (req, res) => {
  const { term, limit } = req.query

  if (term === "") {
    return res.json([])
  }

  const query = Product.aggregate([{ $match: { name: { $regex: term, $options: "i" } } }])

  if (limit) {
    query.limit(Number(limit))
  }

  const results = await query.exec()

  res.json(results)
}
