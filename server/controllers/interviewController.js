const Interview = require("../models/Interview");
const { generateQuestions, evaluateAnswer } = require("../services/geminiService");

// @desc    Start a new interview
// @route   POST /api/interview/start
// @access  Private
const startInterview = async (req, res) => {
  try {
    const { role, country, experience } = req.body;

    if (!role || !country || experience === undefined) {
      return res.status(400).json({ message: "Please provide role, country, and experience" });
    }

    // 1. Generate questions from Gemini
    const questionsList = await generateQuestions(role, country, experience);

    // 2. Format questions for our model
    const formattedQuestions = questionsList.map((q) => ({
      question: q.question,
      answer: "",
      aiFeedback: "",
      score: 0,
    }));

    // 3. Save interview to database
    const interview = await Interview.create({
      user: req.user._id,
      role,
      country,
      experience,
      questions: formattedQuestions,
    });

    res.status(201).json(interview);
  } catch (error) {
    console.error("Start Interview Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit answer for a question
// @route   POST /api/interview/:id/answer
// @access  Private
const submitAnswer = async (req, res) => {
  try {
    const { questionIndex, answer } = req.body;
    const interviewId = req.params.id;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // Check if user owns this interview
    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const questionObj = interview.questions[questionIndex];
    if (!questionObj) {
      return res.status(400).json({ message: "Invalid question index" });
    }

    // 1. Evaluate answer using Gemini
    const evaluation = await evaluateAnswer(
      questionObj.question,
      answer,
      interview.role,
      interview.experience
    );

    // 2. Update question with answer and feedback
    interview.questions[questionIndex].answer = answer;
    interview.questions[questionIndex].aiFeedback = evaluation.aiFeedback;
    interview.questions[questionIndex].score = evaluation.score;
    interview.questions[questionIndex].idealAnswer = evaluation.idealAnswer;

    // 3. Update overall score (average of scored questions)
    const answeredQuestions = interview.questions.filter((q) => q.answer !== "");
    const totalScore = answeredQuestions.reduce((acc, q) => acc + q.score, 0);
    interview.overallScore = totalScore / answeredQuestions.length;

    // 4. Check if all questions are answered
    if (answeredQuestions.length === interview.questions.length) {
      interview.isCompleted = true;
    }

    await interview.save();

    res.json({
      score: evaluation.score,
      aiFeedback: evaluation.aiFeedback,
      idealAnswer: evaluation.idealAnswer,
      isCompleted: interview.isCompleted,
    });
  } catch (error) {
    console.error("Submit Answer Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get interview by ID
// @route   GET /api/interview/:id
// @access  Private
const getInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all user interviews
// @route   GET /api/interview
// @access  Private
const getUserInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  startInterview,
  submitAnswer,
  getInterview,
  getUserInterviews,
};
