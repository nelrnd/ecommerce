const express = require("express")
const Router = express.Router()
const categoryController = require("../controllers/category")

Router.get("/", categoryController.category_list)

Router.post("/", categoryController.category_create)

Router.get("/:slug", categoryController.category_detail)

Router.put("/:slug", categoryController.category_update)

Router.delete("/:slug", categoryController.category_delete)

module.exports = Router
