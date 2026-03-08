const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    required: [true, "Role is required"],
    trim: true,
  },
  country: {
    type: String,
    required: [true, "Country is required"],
    trim: true,
  },
  experience: {
    type: Number,
    required: [true, "Experience is required"],
  },
  questions: [
    {
      question: { type: String, required: true },
      type: { type: String, enum: ["theory", "coding"], default: "theory" },
      initialCode: { type: String, default: "" },
      answer: { type: String },
      aiFeedback: { type: String },
      idealAnswer: { type: String },
      score: { type: Number, default: 0 },
    },
  ],
  overallScore: {
    type: Number,
    default: 0,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Interview", interviewSchema);
