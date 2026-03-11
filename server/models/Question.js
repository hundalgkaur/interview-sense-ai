const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    unique: true, // Prevent duplicate questions in the public vault
  },
  type: {
    type: String,
    enum: ["theory", "coding"],
    default: "theory",
  },
  role: {
    type: String,
    required: true,
    index: true, // For fast searching by role
  },
  experience: {
    type: Number,
    required: true,
  },
  initialCode: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("PublicQuestion", questionSchema);