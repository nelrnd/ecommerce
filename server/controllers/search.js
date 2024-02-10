const Product = require("../models/product")

exports.search_get = async (req, res) => {
  const { term } = req.query

  if (term === "") {
    return res.json([])
  }

  const results = await Product.aggregate([{ $match: { name: { $regex: term, $options: "i" } } }]).limit(6)

  res.json(results)
}
