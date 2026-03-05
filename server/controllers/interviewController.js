const { generateInterviewQuestions } = require("../services/geminiService");

async function createInterview(req, res) {
    console.log("interview api called");

  const { role, country, experience } = req.body;

  try {

    const questions = await generateInterviewQuestions(
      role,
      country,
      experience
    );

    res.json({
      success: true,
      questions
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

}

module.exports = { createInterview };