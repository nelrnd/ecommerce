const express = require("express")
const Router = express.Router()
const productController = require("../controllers/product")

Router.get("/", productController.product_list)

Router.post("/", productController.product_create)

Router.get("/:slug", productController.product_detail)

Router.put("/:slug", productController.product_update)

Router.delete("/:slug", productController.product_delete)

module.exports = Router
