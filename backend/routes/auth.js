const express = require("express")
const router = express.Router()
const User = require("../models/user")

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    const newUser = new User({ name, email, password })
    await newUser.save()

    res.json({ message: "User registered successfully" })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" })
    }

    res.json({
      message: "Login successful",
      user
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router