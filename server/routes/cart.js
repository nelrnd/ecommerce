const express = require("express")
const Router = express.Router()
const cartController = require("../controllers/cart")

Router.post("/", cartController.cart_create)

Router.get("/:cartId", cartController.cart_get)

Router.delete("/:cartId", cartController.cart_delete)

Router.post("/:cartId", cartController.cart_item_create, cartController.cart_get)

Router.put("/:cartId/item/:itemId", cartController.cart_item_update, cartController.cart_get)

Router.delete("/:cartId/item/:itemId", cartController.cart_item_delete, cartController.cart_get)

module.exports = Router
