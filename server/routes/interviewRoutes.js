const express = require("express");
const router = express.Router();
const {
  startInterview,
  submitAnswer,
  getInterview,
  getUserInterviews,
} = require("../controllers/interviewController");
const { protect } = require("../middleware/authMiddleware");

// All routes are protected
router.use(protect);

router.post("/start", startInterview);
router.post("/:id/answer", submitAnswer);
router.get("/:id", getInterview);
router.get("/", getUserInterviews);

module.exports = router;
