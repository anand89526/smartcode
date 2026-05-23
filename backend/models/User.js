/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  avatarUrl: {
    type: String,
    default: ""
  },
  headline: {
    type: String,
    default: "Competitive programmer leveling up every day."
  },
  password: {
    type: String,
    required: true
  },
  solvedProblems: {
    type: Number,
    default: 0
  },
  rank: {
    type: Number,
    default: 0
  },
  streak: {
    type: Number,
    default: 0
  },
  battleWins: {
    type: Number,
    default: 0
  },
  contests: {
    type: Number,
    default: 0
  },
  points: {
    type: Number,
    default: 0
  },
  totalSubmissions: {
    type: Number,
    default: 0
  },
  acceptedSubmissions: {
    type: Number,
    default: 0
  },
  level: {
    type: String,
    default: "Rising Coder"
  },
  country: {
    type: String,
    default: "India"
  },
  bio: {
    type: String,
    default: "Building consistency one problem at a time."
  },
  solvedProblemIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem"
    }
  ],
  favoriteProblemIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem"
    }
  ],
  lastSolvedAt: {
    type: Date,
    default: null
  },
  lastActiveAt: {
    type: Date,
    default: null
  }
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)
