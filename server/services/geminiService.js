const { GoogleGenerativeAI } = require("@google/generative-ai");
const {
  generateQuestionsPrompt,
  evaluateAnswerPrompt,
} = require("../utils/promptTemplates");
const config = require("../config");

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

// Helper function to robustly parse JSON from AI response
const parseAIResponse = (text) => {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text.trim());
  } catch (err) {
    console.error("AI JSON Parse Error:", err.message, "Text received:", text);
    throw new Error("Failed to parse valid JSON from AI response");
  }
};

// @desc    Generate interview questions
const generateQuestions = async (role, country, experience, resumeSkills = "", persona = "standard") => {
  try {
    if (!config.GEMINI_API_KEY || config.GEMINI_API_KEY.includes("your_")) {
       return getMockQuestions(role);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = generateQuestionsPrompt(role, country, experience, resumeSkills, persona);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const data = parseAIResponse(text);
    return data.questions || getMockQuestions(role);
  } catch (error) {
    console.error("Gemini API Error (Questions):", error.message);
    return getMockQuestions(role);
  }
};

// @desc    Extract skills from resume text
const extractSkillsFromResume = async (resumeText) => {
  try {
    if (!config.GEMINI_API_KEY || config.GEMINI_API_KEY.includes("your_")) {
       return "React, Node.js, JavaScript, MongoDB"; 
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `From the following resume text, identify and list only the most relevant technical skills as a comma-separated list. Limit to 10 skills. 
    Resume Text: "${resumeText}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Gemini API Error (Skills Extraction):", error.message);
    return "React, Node.js, JavaScript, MongoDB";
  }
};

// @desc    Evaluate answer
const evaluateAnswer = async (question, answer, role, experience, persona = "standard") => {
  try {
    if (!config.GEMINI_API_KEY || config.GEMINI_API_KEY.includes("your_")) {
       return getMockEvaluation(question, answer, persona);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = evaluateAnswerPrompt(question, answer, role, experience, persona);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return parseAIResponse(text);
  } catch (error) {
    console.error("Gemini API Error (Evaluation):", error.message);
    return getMockEvaluation(question, answer, persona);
  }
};

const getMockQuestions = (role) => [
  { 
    question: `What are the core responsibilities of a ${role}?`,
    type: "theory",
    initialCode: ""
  },
  { 
    question: `Write a function to reverse a string in place.`,
    type: "coding",
    initialCode: "function reverseString(str) {\n  // Write your code here\n}"
  },
  { 
    question: `How do you stay updated with the latest trends?`,
    type: "theory",
    initialCode: ""
  },
  { 
    question: `Describe a conflict with a teammate and its resolution.`,
    type: "theory",
    initialCode: ""
  },
  { 
    question: `Write a function to check if a number is prime.`,
    type: "coding",
    initialCode: "function isPrime(num) {\n  // Write your code here\n}"
  }
];

const getMockEvaluation = (question, answer, persona) => {
  const trimmedAnswer = answer.trim().toLowerCase();
  let score = 7;
  let summary = "Solid professional effort.";
  let strengths = "Good use of keywords.";
  let weaknesses = "Could benefit from more metrics.";
  let advice = "Use the STAR method.";

  if (trimmedAnswer.length < 10) {
    score = 2;
    summary = "Answer too short.";
    strengths = "None identified.";
    weaknesses = "Insufficient data.";
    advice = "Provide more detail.";
  }

  const aiFeedback = `EXAMINER REPORT:
----------------
SUMMARY: ${summary}
STRENGTHS: ${strengths}
AREAS FOR IMPROVEMENT: ${weaknesses}
TEACHER'S ADVICE: ${advice}

(Simulated for ${persona} persona)`;

  return {
    score,
    aiFeedback,
    idealAnswer: "Sample ideal answer for demonstration.",
    followUp: ""
  };
};

module.exports = {
  generateQuestions,
  evaluateAnswer,
  extractSkillsFromResume,
};
