const express = require("express");
const router = express.Router();
const {
  startInterview,
  submitAnswer,
  getInterview,
  getUserInterviews,
} = require("../controllers/interviewController");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const pdf = require("pdf-parse");

const upload = multer({ storage: multer.memoryStorage() });

// All routes are protected
router.use(protect);

router.post("/upload-resume", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("Parsing PDF, buffer size:", req.file.buffer.length);
    const data = await pdf(req.file.buffer);
    
    if (!data.text || data.text.trim().length === 0) {
        console.warn("PDF parsed but no text extracted (possibly scanned or empty)");
        return res.status(400).json({ message: "Could not extract text from this PDF. Please ensure it is not a scanned image." });
    }

    res.json({ text: data.text });
  } catch (error) {
    console.error("Resume Upload Error DETAILS:", error);
    res.status(500).json({ message: `Failed to parse resume: ${error.message}` });
  }
});

router.post("/start", startInterview);
router.post("/:id/answer", submitAnswer);
router.get("/:id", getInterview);
router.get("/", getUserInterviews);

module.exports = router;
