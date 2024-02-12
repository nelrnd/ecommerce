const express = require("express")
const Router = express.Router()
const productController = require("../controllers/product")
const authController = require("../controllers/auth")

Router.get("/", productController.product_list)

Router.post("/", authController.isAdmin, productController.product_create)

Router.get("/:slug", productController.product_detail)

Router.put("/:slug", authController.isAdmin, productController.product_update)

Router.delete("/:slug", authController.isAdmin, productController.product_delete)

module.exports = Router
