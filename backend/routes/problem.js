const express = require("express")
const router = express.Router()
const Problem = require("../models/problem")

// ADD PROBLEM
router.post("/add", async (req, res) => {
  try {
    const problem = new Problem(req.body)
    await problem.save()

    res.json({ message: "Problem added successfully" })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET ALL PROBLEMS
router.get("/", async (req, res) => {
  try {
    const problems = await Problem.find()
    res.json(problems)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router