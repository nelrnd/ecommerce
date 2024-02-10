const express = require("express")
const Router = express.Router()
const searchController = require("../controllers/search")

Router.get("/", searchController.search_get)

module.exports = Router
