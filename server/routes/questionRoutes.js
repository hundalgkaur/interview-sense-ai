const express = require("express");
const router = express.Router();
const PublicQuestion = require("../models/Question");

// @desc    Get all public questions for SEO vault
// @route   GET /api/questions
// @access  Public
router.get("/", async (req, res) => {
  try {
    const questions = await PublicQuestion.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;