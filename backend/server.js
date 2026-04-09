const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

require("dotenv").config()

const app = express()

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))
app.use(express.json())

// ROUTES
// ROUTES
const authRoutes = require("./routes/auth")
const problemRoutes = require("./routes/problem")

app.use("/api/auth", authRoutes)
app.use("/api/problems", problemRoutes)
// TEST
app.get("/", (req, res) => {
  res.send("SmartCode Backend Running 🚀")
})

// DB
mongoose.connect("mongodb://127.0.0.1:27017/smartcode")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err))

app.listen(5000, () => {
  console.log("Server running on port 5000")
})