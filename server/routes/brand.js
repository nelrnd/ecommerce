const express = require("express")
const Router = express.Router()
const brandController = require("../controllers/brand")

Router.get("/", brandController.brand_list)

Router.post("/", brandController.brand_create)

Router.get("/:slug", brandController.brand_detail)

Router.put("/:slug", brandController.brand_update)

Router.delete("/:slug", brandController.brand_delete)

module.exports = Router
