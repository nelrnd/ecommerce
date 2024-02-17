const express = require("express")
const Router = express.Router()
const cartController = require("../controllers/cart")

Router.post("/:cartId", cartController.cart_create_item)

module.exports = Router
