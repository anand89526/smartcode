/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require("mongoose")

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
  companies: {
    type: [String],
    default: []
  },
  points: {
    type: Number,
    default: 100
  },
  compareMode: {
    type: String,
    enum: ["exact", "unordered_array", "unordered_nested"],
    default: "exact"
  },
  acceptanceRate: {
    type: Number,
    default: 0
  },
  inputExample: {
    type: String
  },
  outputExample: {
    type: String
  },
  examples: {
    type: [
      {
        input: String,
        output: String,
        explanation: String
      }
    ],
    default: []
  },
  pseudocode: {
    type: String,
    default: ""
  },
  functionName: {
    type: String,
    default: ""
  },
  starterCode: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  testCases: {
    type: [
      {
        args: {
          type: [mongoose.Schema.Types.Mixed],
          default: []
        },
        expected: mongoose.Schema.Types.Mixed
      }
    ],
    default: []
  }
}, { timestamps: true })

module.exports = mongoose.model("Problem", problemSchema)
