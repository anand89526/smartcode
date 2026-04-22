/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express")
const router = express.Router()
const User = require("../models/User")
const Problem = require("../models/problem")
const Submission = require("../models/Submission")
const Battle = require("../models/Battle")
const { recomputeRankings } = require("../lib/rankings")
const { serializeUser } = require("../lib/serializers")

const seededAccountEmail = "anandsinghoriginal@gmail.com"

function getProfileDefaults(email) {
  if ((email || "").toLowerCase() === seededAccountEmail) {
    return {
      avatarUrl: "",
      headline: "Knight-tier DSA grinder and battle specialist.",
      solvedProblems: 10,
      streak: 7,
      battleWins: 14,
      contests: 8,
      points: 2480,
      level: "Knight",
      country: "India",
      bio: "Focused on DSA, contests, and fast interview prep.",
      totalSubmissions: 18,
      acceptedSubmissions: 10
    }
  }

  return {
    avatarUrl: "",
    headline: "Competitive programmer leveling up every day.",
    solvedProblems: 0,
    streak: 0,
    battleWins: 0,
    contests: 0,
    points: 0,
    level: "Rising Coder",
    country: "India",
    bio: "Building consistency one problem at a time.",
    totalSubmissions: 0,
    acceptedSubmissions: 0
  }
}

async function getLeaderboard(limit = 10) {
  const users = await User.find()
    .sort({ rank: 1, points: -1, solvedProblems: -1 })
    .limit(limit)

  return users.map((user) => serializeUser(user))
}

function getOnlineThreshold() {
  return new Date(Date.now() - 5 * 60 * 1000)
}

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    const newUser = new User({
      name,
      email,
      password,
      ...getProfileDefaults(email)
    })
    await newUser.save()
    await recomputeRankings()

    const freshUser = await User.findById(newUser._id)

    res.json({
      message: "User registered successfully",
      user: serializeUser(freshUser || newUser)
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

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

    user.lastActiveAt = new Date()
    await user.save()

    if (!user.rank) {
      await recomputeRankings()
    }

    const freshUser = await User.findById(user._id)

    res.json({
      message: "Login successful",
      user: serializeUser(freshUser || user)
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post("/presence/:userId", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { lastActiveAt: new Date() },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const [onlineUsers, activeBattles, queueUsers] = await Promise.all([
      User.countDocuments({ lastActiveAt: { $gte: getOnlineThreshold() } }),
      Battle.countDocuments({ status: "active" }),
      Battle.countDocuments({ status: "pending" })
    ])

    res.json({
      user: serializeUser(user),
      stats: {
        onlineUsers,
        activeBattles,
        queueUsers
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get("/profile/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({ user: serializeUser(user) })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put("/profile/:userId", async (req, res) => {
  try {
    const normalizeText = (value, fallback = "") =>
      typeof value === "string" ? value.trim() : fallback

    const allowedUpdates = {
      name: normalizeText(req.body.name),
      bio: normalizeText(req.body.bio),
      country: normalizeText(req.body.country),
      headline: normalizeText(req.body.headline),
      avatarUrl: normalizeText(req.body.avatarUrl)
    }

    if (!allowedUpdates.name) {
      return res.status(400).json({ message: "Display name is required" })
    }

    const user = await User.findByIdAndUpdate(req.params.userId, allowedUpdates, {
      new: true,
      runValidators: true
    })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({
      message: "Profile updated successfully",
      user: serializeUser(user)
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put("/profile/:userId/password", async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All password fields are required" })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters long" })
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirmation do not match" })
    }

    const user = await User.findById(req.params.userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (user.password !== currentPassword) {
      return res.status(400).json({ message: "Current password is incorrect" })
    }

    user.password = newPassword
    await user.save()

    res.json({ message: "Password updated successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get("/leaderboard", async (req, res) => {
  try {
    const leaderboard = await getLeaderboard(Number(req.query.limit) || 20)
    res.json({ leaderboard })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get("/dashboard/:userId", async (req, res) => {
  try {
    const { userId } = req.params
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    user.lastActiveAt = new Date()
    await user.save()

    const [
      leaderboard,
      totalUsers,
      totalProblems,
      totalSubmissions,
      acceptedSubmissions,
      onlineUsers,
      activeBattles,
      queueUsers,
      recentSubmissions,
      allProblems
    ] = await Promise.all([
      getLeaderboard(5),
      User.countDocuments(),
      Problem.countDocuments(),
      Submission.countDocuments(),
      Submission.countDocuments({ status: "accepted" }),
      User.countDocuments({ lastActiveAt: { $gte: getOnlineThreshold() } }),
      Battle.countDocuments({ status: "active" }),
      Battle.countDocuments({ status: "pending" }),
      Submission.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("problemId", "title difficulty slug"),
      Problem.find().sort({ points: -1, createdAt: 1 })
    ])

    const solvedIds = new Set((user.solvedProblemIds || []).map((id) => id.toString()))

    const recommendedProblems = allProblems
      .filter((problem) => !solvedIds.has(problem._id.toString()))
      .slice(0, 4)
      .map((problem) => ({
        id: problem._id.toString(),
        title: problem.title,
        difficulty: problem.difficulty,
        tags: problem.tags,
        points: problem.points,
        slug: problem.slug
      }))

    res.json({
      user: serializeUser(user),
      leaderboard,
      recommendedProblems,
      recentSubmissions: recentSubmissions.map((submission) => ({
        id: submission._id.toString(),
        status: submission.status,
        createdAt: submission.createdAt,
        passedCount: submission.passedCount,
        totalCount: submission.totalCount,
        problem: submission.problemId
      })),
      stats: {
        totalUsers,
        totalProblems,
        totalSubmissions,
        acceptanceRate: totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0,
        onlineUsers,
        activeBattles,
        queueUsers
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
