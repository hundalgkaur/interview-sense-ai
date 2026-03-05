const express = require("express");
const router = express.Router();

const { createInterview } = require("../controllers/interviewController");

router.post("/generate", createInterview);

module.exports = router;