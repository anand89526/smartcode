/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express")
const router = express.Router()
const Problem = require("../models/problem")
const Submission = require("../models/Submission")
const User = require("../models/User")
const { evaluateSubmission } = require("../lib/judge")
const { recomputeRankings } = require("../lib/rankings")
const { serializeUser } = require("../lib/serializers")

function getDifficultyOrder(difficulty) {
  if (difficulty === "Easy") {
    return 1
  }
  if (difficulty === "Medium") {
    return 2
  }
  return 3
}

function getDaySeed() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now - start
  return Math.floor(diff / 86400000)
}

function getDailyWeight(problem, seed) {
  const statsWeight = (problem.totalSubmissions || 0) * 3 + problem.points
  const titleWeight = problem.title.split("").reduce((total, char) => total + char.charCodeAt(0), 0)
  return ((titleWeight + seed * 37 + statsWeight) % 1000) + statsWeight
}

function getDerivedLevel(points) {
  if (points >= 2500) {
    return "Grandmaster"
  }
  if (points >= 1800) {
    return "Knight"
  }
  if (points >= 1000) {
    return "Specialist"
  }
  return "Rising Coder"
}

function getStreakUpdate(lastSolvedAt) {
  if (!lastSolvedAt) {
    return 1
  }

  const previous = new Date(lastSolvedAt)
  const now = new Date()
  const previousDay = new Date(previous.getFullYear(), previous.getMonth(), previous.getDate())
  const currentDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const diff = Math.round((currentDay.getTime() - previousDay.getTime()) / 86400000)

  if (diff <= 0) {
    return null
  }

  if (diff === 1) {
    return "increment"
  }

  return 1
}

router.post("/add", async (req, res) => {
  try {
    const problem = new Problem(req.body)
    await problem.save()

    res.json({ message: "Problem added successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get("/", async (req, res) => {
  try {
    const problems = await Problem.find().sort({ createdAt: 1 })
    const userId = req.query.userId
    let solvedProblemIds = new Set()

    if (userId) {
      const user = await User.findById(userId).select("solvedProblemIds")
      solvedProblemIds = new Set((user?.solvedProblemIds || []).map((id) => id.toString()))
    }

    const submissionCounts = await Submission.aggregate([
      {
        $group: {
          _id: "$problemId",
          totalSubmissions: { $sum: 1 },
          acceptedSubmissions: {
            $sum: {
              $cond: [{ $eq: ["$status", "accepted"] }, 1, 0]
            }
          }
        }
      }
    ])

    const countsByProblem = submissionCounts.reduce((accumulator, item) => {
      accumulator[item._id.toString()] = item
      return accumulator
    }, {})

    const enrichedProblems = problems
      .map((problem) => {
        const stats = countsByProblem[problem._id.toString()]
        const totalSubmissions = stats?.totalSubmissions || 0
        const accepted = stats?.acceptedSubmissions || 0

        return {
          id: problem._id.toString(),
          title: problem.title,
          slug: problem.slug,
          difficulty: problem.difficulty,
          description: problem.description,
          tags: problem.tags,
          points: problem.points,
          examples: problem.examples,
          totalSubmissions,
          acceptanceRate: totalSubmissions > 0 ? Math.round((accepted / totalSubmissions) * 100) : problem.acceptanceRate,
          solved: solvedProblemIds.has(problem._id.toString())
        }
      })

    const orderedLibrary = [...enrichedProblems].sort(
      (a, b) =>
        getDifficultyOrder(a.difficulty) - getDifficultyOrder(b.difficulty) ||
        b.points - a.points ||
        a.title.localeCompare(b.title)
    )

    const daySeed = getDaySeed()
    const topTen = [...enrichedProblems]
      .sort((a, b) => b.points - a.points || b.acceptanceRate - a.acceptanceRate)
      .slice(0, 10)

    const trendingToday = [...enrichedProblems]
      .sort((a, b) => getDailyWeight(b, daySeed) - getDailyWeight(a, daySeed))
      .slice(0, 10)

    res.json({
      topTen,
      trendingToday,
      problems: orderedLibrary,
      totalCount: orderedLibrary.length
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get("/:id", async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id)
    const relatedProblems = await Problem.find({ _id: { $ne: req.params.id } })
      .sort({ points: -1, createdAt: 1 })
      .limit(2)

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" })
    }

    res.json({
      problem: {
        id: problem._id.toString(),
        title: problem.title,
        slug: problem.slug,
        difficulty: problem.difficulty,
        description: problem.description,
        tags: problem.tags,
        points: problem.points,
        examples: problem.examples,
        pseudocode: problem.pseudocode,
        functionName: problem.functionName,
        starterCode: problem.starterCode,
        supportedLanguages: Object.keys(problem.starterCode || {})
      },
      relatedProblems: relatedProblems.map((item) => ({
        id: item._id.toString(),
        title: item.title,
        difficulty: item.difficulty,
        points: item.points,
        slug: item.slug
      }))
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post("/:id/run", async (req, res) => {
  try {
    const { code, language = "javascript" } = req.body
    const problem = await Problem.findById(req.params.id)

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" })
    }

    const result = await evaluateSubmission(problem, code, language)
    res.json({ result })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post("/:id/submit", async (req, res) => {
  try {
    const { userId, code, language = "javascript" } = req.body
    const [problem, user] = await Promise.all([
      Problem.findById(req.params.id),
      User.findById(userId)
    ])

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" })
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const result = await evaluateSubmission(problem, code, language)

    const submission = await Submission.create({
      userId,
      problemId: problem._id,
      language,
      code,
      status: result.status,
      passedCount: result.passed,
      totalCount: result.total,
      details: result
    })

    user.totalSubmissions += 1
    user.lastActiveAt = new Date()

    if (result.status === "accepted") {
      user.acceptedSubmissions += 1

      const alreadySolved = (user.solvedProblemIds || []).some(
        (id) => id.toString() === problem._id.toString()
      )

      if (!alreadySolved) {
        user.solvedProblemIds.push(problem._id)
        user.solvedProblems += 1
        user.points += problem.points
        user.level = getDerivedLevel(user.points)

        const streakUpdate = getStreakUpdate(user.lastSolvedAt)
        if (streakUpdate === "increment") {
          user.streak += 1
        } else if (typeof streakUpdate === "number") {
          user.streak = streakUpdate
        }

        user.lastSolvedAt = new Date()
      }
    }

    await user.save()
    await recomputeRankings()

    const freshUser = await User.findById(userId)

    res.json({
      message:
        result.status === "accepted"
          ? "Submission accepted"
          : result.status === "wrong_answer"
            ? "Wrong answer"
            : result.status === "compile_error"
              ? "Compile error"
            : "Runtime error",
      result,
      submissionId: submission._id.toString(),
      user: serializeUser(freshUser || user)
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
