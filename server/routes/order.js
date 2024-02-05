const express = require("express")
const Router = express.Router()
const orderController = require("../controllers/order")

Router.get("/", orderController.order_list)

Router.post("/", orderController.order_create)

Router.get("/:id", orderController.order_detail)

module.exports = Router
