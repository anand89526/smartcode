/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

require("dotenv").config()

const app = express()

const port = process.env.PORT || 5000
const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/smartcode"
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
      return
    }

    callback(new Error("Not allowed by CORS"))
  },
  credentials: true
}))
app.use(express.json())

// ROUTES
// ROUTES
const authRoutes = require("./routes/auth")
const problemRoutes = require("./routes/problem")
const battleRoutes = require("./routes/battle")
const { seedProblems } = require("./lib/seed")

app.use("/api/auth", authRoutes)
app.use("/api/problems", problemRoutes)
app.use("/api/battles", battleRoutes)
// TEST
app.get("/", (req, res) => {
  res.send("SmartCode Backend Running 🚀")
})

// DB
mongoose.connect(mongoUri)
  .then(async () => {
    await seedProblems()
    console.log("MongoDB Connected")
  })
  .catch(err => console.log(err))

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
