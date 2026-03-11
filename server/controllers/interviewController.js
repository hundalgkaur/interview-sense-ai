const Interview = require("../models/Interview");
const User = require("../models/User");
const PublicQuestion = require("../models/Question");
const { 
  generateQuestions, 
  evaluateAnswer, 
  extractSkillsFromResume 
} = require("../services/geminiService");

// @desc    Start a new interview
const startInterview = async (req, res) => {
  try {
    const { role, country, experience, resumeText, persona = "standard" } = req.body;

    if (!role || !country || experience === undefined) {
      return res.status(400).json({ message: "Please provide role, country, and experience" });
    }

    let resumeSkills = "";
    if (resumeText) {
      resumeSkills = await extractSkillsFromResume(resumeText);
    }

    const questionsList = await generateQuestions(role, country, experience, resumeSkills, persona);

    // Save unique questions to Public Vault for SEO
    try {
      const publicQuestions = questionsList.map(q => ({
        text: q.question,
        type: q.type || "theory",
        role: role,
        experience: experience,
        initialCode: q.initialCode || ""
      }));
      // ordered: false allows continuing even if some questions are duplicates
      await PublicQuestion.insertMany(publicQuestions, { ordered: false });
    } catch (err) {
      // Ignore duplicate key errors, it just means the question is already in the vault
    }

    const formattedQuestions = questionsList.map((q) => ({
      question: q.question,
      type: q.type || "theory",
      initialCode: q.initialCode || "",
      answer: "",
      aiFeedback: "",
      score: 0,
    }));

    const interview = await Interview.create({
      user: req.user._id,
      role,
      country,
      experience,
      persona,
      questions: formattedQuestions,
    });

    res.status(201).json(interview);
  } catch (error) {
    console.error("Start Interview Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit answer for a question
const submitAnswer = async (req, res) => {
  try {
    const { questionIndex, answer } = req.body;
    const interviewId = req.params.id;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const questionObj = interview.questions[questionIndex];
    if (!questionObj) {
      return res.status(400).json({ message: "Invalid question index" });
    }

    const evaluation = await evaluateAnswer(
      questionObj.question,
      answer,
      interview.role,
      interview.experience,
      interview.persona
    );

    interview.questions[questionIndex].answer = answer;
    interview.questions[questionIndex].aiFeedback = evaluation.aiFeedback;
    interview.questions[questionIndex].score = evaluation.score;
    interview.questions[questionIndex].idealAnswer = evaluation.idealAnswer;

    const answeredQuestions = interview.questions.filter((q) => q.answer !== "");
    const totalScore = answeredQuestions.reduce((acc, q) => acc + q.score, 0);
    interview.overallScore = totalScore / answeredQuestions.length;

    if (answeredQuestions.length === interview.questions.length) {
      interview.isCompleted = true;
    }

    await interview.save();

    // --- Streak Tracking Logic ---
    const user = await User.findById(req.user._id);
    const now = new Date();
    const lastAnswered = user.lastAnsweredAt;

    if (!lastAnswered) {
      user.currentStreak = 1;
    } else {
      const diffInTime = now.getTime() - lastAnswered.getTime();
      const diffInDays = diffInTime / (1000 * 3600 * 24);

      if (diffInDays < 1) {
        // Already answered today, keep streak
      } else if (diffInDays < 2) {
        // Answered yesterday, increment streak
        user.currentStreak += 1;
      } else {
        // Missed a day, reset streak
        user.currentStreak = 1;
      }
    }
    user.lastAnsweredAt = now;
    await user.save();

    res.json({
      score: evaluation.score,
      aiFeedback: evaluation.aiFeedback,
      idealAnswer: evaluation.idealAnswer,
      followUp: evaluation.followUp,
      isCompleted: interview.isCompleted,
      streak: user.currentStreak
    });
  } catch (error) {
    console.error("Submit Answer Error:", error);
    res.status(500).json({ message: error.message });
  }
};

const getInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ message: "Interview not found" });
    if (interview.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: "Not authorized" });
    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an interview
// @route   DELETE /api/interview/:id
// @access  Private
const deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // Check ownership
    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to delete this record" });
    }

    await interview.deleteOne();
    res.json({ message: "Simulation record purged from archives." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get public certificate data
// @route   GET /api/interview/public/certificate/:id
// @access  Public
const getPublicCertificate = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id).populate("user", "name");
    if (!interview || !interview.isCompleted) {
      return res.status(404).json({ message: "Certificate not found or simulation incomplete" });
    }

    // Return only sanitized data for public view
    const publicData = {
      userName: interview.user.name,
      role: interview.role,
      country: interview.country,
      experience: interview.experience,
      overallScore: interview.overallScore,
      createdAt: interview.createdAt,
      radarData: interview.questions.map((q, i) => ({
        subject: i === 0 ? "Technical" : i === 1 ? "Logic" : i === 2 ? "Comm" : i === 3 ? "Exp" : "Standard",
        score: q.score
      }))
    };

    res.json(publicData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  startInterview,
  submitAnswer,
  getInterview,
  getUserInterviews,
  getPublicCertificate,
  deleteInterview,
};
