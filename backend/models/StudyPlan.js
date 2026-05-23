/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require("mongoose")

const studyPlanSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: "#3b82f6"
  },
  problems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem"
    }
  ]
}, { timestamps: true })

module.exports = mongoose.model("StudyPlan", studyPlanSchema)
