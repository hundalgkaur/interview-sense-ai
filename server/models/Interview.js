const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true
  },

  country: {
    type: String,
    required: true
  },

  experience: {
    type: Number,
    required: true
  },

  questions: [
    {
      question: String,
      answer: String,
      aiFeedback: String,
      score: Number
    }
  ],

  totalScore: {
    type: Number,
    default: 0
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Interview", interviewSchema);