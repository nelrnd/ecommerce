const express = require("express")
const Router = express.Router()
const brandController = require("../controllers/brand")
const authController = require("../controllers/auth")

Router.get("/", brandController.brand_list)

Router.post("/", authController.isAdmin, brandController.brand_create)

Router.get("/:slug", brandController.brand_detail)

Router.put("/:slug", authController.isAdmin, brandController.brand_update)

Router.delete("/:slug", authController.isAdmin, brandController.brand_delete)

module.exports = Router
