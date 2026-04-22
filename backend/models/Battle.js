/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require("mongoose")

const battleSchema = new mongoose.Schema(
  {
    challengerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    opponentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "active", "completed", "cancelled"],
      default: "pending"
    },
    prizePoints: {
      type: Number,
      default: 80
    },
    winnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    startedAt: {
      type: Date,
      default: null
    },
    completedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("Battle", battleSchema)
