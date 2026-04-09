const mongoose = require("mongoose")

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
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
  inputExample: {
    type: String
  },
  outputExample: {
    type: String
  }
}, { timestamps: true })

module.exports = mongoose.model("Problem", problemSchema)