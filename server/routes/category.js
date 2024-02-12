const express = require("express")
const Router = express.Router()
const categoryController = require("../controllers/category")
const authController = require("../controllers/auth")

Router.get("/", categoryController.category_list)

Router.post("/", authController.isAdmin, categoryController.category_create)

Router.get("/:slug", categoryController.category_detail)

Router.put("/:slug", authController.isAdmin, categoryController.category_update)

Router.delete("/:slug", authController.isAdmin, categoryController.category_delete)

module.exports = Router
