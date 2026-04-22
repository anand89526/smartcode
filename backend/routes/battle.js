/* eslint-disable @typescript-eslint/no-require-imports */
const express = require("express")
const router = express.Router()
const Battle = require("../models/Battle")
const Problem = require("../models/problem")
const User = require("../models/User")
const { evaluateSubmission } = require("../lib/judge")
const { recomputeRankings } = require("../lib/rankings")
const { serializeUser } = require("../lib/serializers")

function getOnlineThreshold() {
  return new Date(Date.now() - 5 * 60 * 1000)
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

async function getBattleStats() {
  const [onlineUsers, activeBattles, queueUsers] = await Promise.all([
    User.countDocuments({ lastActiveAt: { $gte: getOnlineThreshold() } }),
    Battle.countDocuments({ status: "active" }),
    Battle.countDocuments({ status: "pending" })
  ])

  return { onlineUsers, activeBattles, queueUsers }
}

async function getUserBattle(userId) {
  return Battle.findOne({
    status: { $in: ["pending", "active"] },
    $or: [{ challengerId: userId }, { opponentId: userId }]
  })
    .sort({ createdAt: -1 })
    .populate("challengerId", "name points rank")
    .populate("opponentId", "name points rank")
    .populate("problemId", "title difficulty description tags points starterCode examples pseudocode functionName")
    .populate("winnerId", "name")
}

router.post("/join", async (req, res) => {
  try {
    const { userId } = req.body
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    user.lastActiveAt = new Date()
    await user.save()

    const existingBattle = await getUserBattle(userId)

    if (existingBattle) {
      return res.json({
        message: existingBattle.status === "pending" ? "Waiting for an opponent" : "Battle is active",
        battle: existingBattle,
        stats: await getBattleStats()
      })
    }

    const opponentBattle = await Battle.findOne({
      status: "pending",
      challengerId: { $ne: userId }
    }).sort({ createdAt: 1 })

    if (opponentBattle) {
      opponentBattle.opponentId = userId
      opponentBattle.status = "active"
      opponentBattle.startedAt = new Date()
      await opponentBattle.save()

      const challenger = await User.findById(opponentBattle.challengerId)
      if (challenger) {
        challenger.contests += 1
        await challenger.save()
      }

      user.contests += 1
      await user.save()

      const activeBattle = await getUserBattle(userId)
      return res.json({
        message: "Battle matched",
        battle: activeBattle,
        stats: await getBattleStats()
      })
    }

    const problems = await Problem.find().sort({ points: -1, createdAt: 1 })
    const randomProblem = problems[Math.floor(Math.random() * problems.length)]

    const pendingBattle = await Battle.create({
      challengerId: userId,
      problemId: randomProblem._id,
      prizePoints: Math.max(60, randomProblem.points)
    })

    const battle = await getUserBattle(userId)

    res.json({
      message: "Waiting for an opponent",
      battle: battle || pendingBattle,
      stats: await getBattleStats()
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get("/state/:userId", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { lastActiveAt: new Date() },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const battle = await getUserBattle(req.params.userId)

    res.json({
      battle,
      user: serializeUser(user),
      stats: await getBattleStats()
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post("/submit/:battleId", async (req, res) => {
  try {
    const { userId, code, language } = req.body
    const battle = await Battle.findById(req.params.battleId).populate("problemId")

    if (!battle || battle.status !== "active") {
      return res.status(404).json({ message: "Active battle not found" })
    }

    if (![String(battle.challengerId), String(battle.opponentId)].includes(String(userId))) {
      return res.status(403).json({ message: "You are not part of this battle" })
    }

    const result = await evaluateSubmission(battle.problemId, code, language)

    if (result.status === "accepted" && !battle.winnerId) {
      battle.winnerId = userId
      battle.status = "completed"
      battle.completedAt = new Date()
      await battle.save()

      const winner = await User.findById(userId)
      if (winner) {
        winner.points += battle.prizePoints
        winner.battleWins += 1
        winner.level = getDerivedLevel(winner.points)
        winner.lastActiveAt = new Date()
        await winner.save()
      }

      await recomputeRankings()

      const freshUser = await User.findById(userId)

      return res.json({
        message: "Battle won",
        result,
        battle,
        user: freshUser ? serializeUser(freshUser) : null,
        stats: await getBattleStats()
      })
    }

    res.json({
      message:
        result.status === "accepted"
          ? "Accepted, but another player already won this battle."
          : "Battle submission evaluated",
      result,
      battle,
      stats: await getBattleStats()
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
