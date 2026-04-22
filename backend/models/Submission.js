/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require("mongoose")

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true
    },
    language: {
      type: String,
      default: "javascript"
    },
    code: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["accepted", "wrong_answer", "runtime_error", "compile_error"],
      required: true
    },
    passedCount: {
      type: Number,
      default: 0
    },
    totalCount: {
      type: Number,
      default: 0
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("Submission", submissionSchema)
