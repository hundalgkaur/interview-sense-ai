const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const {
  startInterview,
  submitAnswer,
  getInterview,
  getUserInterviews,
  deleteInterview,
} = require("../controllers/interviewController");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const pdf = require("pdf-parse");

const upload = multer({ storage: multer.memoryStorage() });

// Rate limiter for starting new interviews (protects Gemini API costs)
const interviewStartLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 interview starts per windowMs
  message: { message: "Too many interview simulations initialized from this IP. Please try again in an hour." },
  standardHeaders: true,
  legacyHeaders: false,
});

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

router.post("/start", interviewStartLimiter, startInterview);
router.post("/:id/answer", submitAnswer);
router.get("/:id", getInterview);
router.delete("/:id", deleteInterview);
router.get("/", getUserInterviews);

// Public route for certificates (No 'protect' middleware)
const { getPublicCertificate } = require("../controllers/interviewController");
router.get("/public/certificate/:id", getPublicCertificate);

module.exports = router;
