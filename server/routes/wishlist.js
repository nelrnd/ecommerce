const express = require("express")
const Router = express.Router()
const wishlistController = require("../controllers/wishlist")
const authController = require("../controllers/auth")

Router.get("/:wishlistId", authController.isAuth, wishlistController.wishlist_get)

Router.post(
  "/:wishlistId/item",
  authController.isAuth,
  wishlistController.wishlist_item_create,
  wishlistController.wishlist_get
)

Router.put(
  "/:wishlistId/item/:itemId",
  authController.isAuth,
  wishlistController.wishlist_item_update,
  wishlistController.wishlist_get
)

Router.delete(
  "/:wishlistId/item/:itemId",
  authController.isAuth,
  wishlistController.wishlist_item_delete,
  wishlistController.wishlist_get
)

module.exports = Router
