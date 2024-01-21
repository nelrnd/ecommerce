require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()

app.use("/images", express.static("images"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

const mongoDb = process.env.MONGODB_URL
const main = async () => mongoose.connect(mongoDb)
main().catch((err) => console.log(err))

const productRouter = require("./routes/product")
const categoryRouter = require("./routes/category")
app.use("/api/product", productRouter)
app.use("/api/category", categoryRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
