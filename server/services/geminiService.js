const { GoogleGenerativeAI } = require("@google/generative-ai");
const {
  generateQuestionsPrompt,
  evaluateAnswerPrompt,
} = require("../utils/promptTemplates");
const config = require("../config");

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY, { apiVersion: "v1" });

// @desc    Generate interview questions
// @param   role, country, experience
// @return  Array of questions
const generateQuestions = async (role, country, experience) => {
  try {
    if (!config.GEMINI_API_KEY || config.GEMINI_API_KEY.includes("your_")) {
       console.warn("Using Mock Questions: Gemini API Key is missing or placeholder.");
       return getMockQuestions(role);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = generateQuestionsPrompt(role, country, experience);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleanText);
    return data.questions || getMockQuestions(role);
  } catch (error) {
    // If it's an API key issue, log it clearly but still provide mocks so the app doesn't crash
    console.error("Gemini API Error (Questions):", error.message);
    if (error.message.includes("API key not valid")) {
        console.error("URGENT: Your GEMINI_API_KEY in .env is invalid. Using mock data instead.");
    }
    return getMockQuestions(role);
  }
};

// @desc    Evaluate answer
// @param   question, answer, role, experience
// @return  Evaluation object { score, aiFeedback, idealAnswer }
const evaluateAnswer = async (question, answer, role, experience) => {
  try {
    if (!config.GEMINI_API_KEY || config.GEMINI_API_KEY.includes("your_")) {
       return getMockEvaluation(question, answer);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = evaluateAnswerPrompt(question, answer, role, experience);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Gemini API Error (Evaluation):", error.message);
    return getMockEvaluation(question, answer);
  }
};

// Helper for Mock Questions
const getMockQuestions = (role) => [
  { question: `What are the core responsibilities of a ${role}?` },
  { question: `Can you describe a challenging project you worked on as a ${role}?` },
  { question: `How do you stay updated with the latest trends in ${role} technologies?` },
  { question: `Describe a time you had a conflict with a teammate and how you resolved it.` },
  { question: `What is your approach to debugging complex issues?` }
];

// Helper for Mock Evaluation
const getMockEvaluation = (question, answer) => {
  const trimmedAnswer = answer.trim().toLowerCase();
  let score = 0;
  let summary = "";
  let strengths = "";
  let weaknesses = "";
  let advice = "";

  // 1. Technical Relevance Check (Heuristic)
  const techKeywords = [
    "code", "dev", "tech", "software", "program", "app", "web", "data", "system",
    "learn", "study", "blog", "news", "documentation", "github", "stack", "api",
    "database", "frontend", "backend", "fullstack", "react", "node", "javascript",
    "python", "cloud", "deployment", "test", "security", "architecture"
  ];
  
  const isRelevant = techKeywords.some(keyword => trimmedAnswer.includes(keyword));

  // 2. Logic for Scoring and Detailed Teacher-style Feedback
  if (trimmedAnswer.length < 5) {
    score = 0;
    summary = "Answer too short.";
    strengths = "None identified.";
    weaknesses = "The answer is insufficient to evaluate.";
    advice = "Always provide at least 2-3 sentences explaining your thought process.";
  } else if (!isRelevant && trimmedAnswer.length < 30) {
    score = 0;
    summary = "Irrelevant response.";
    strengths = "Attempted to respond.";
    weaknesses = "The content does not address the technical nature of the question.";
    advice = "Ensure you use industry-specific terminology and stay focused on the professional context.";
  } else if (trimmedAnswer.length < 20) {
    score = 1;
    summary = "Very brief response.";
    strengths = "Identified the topic.";
    weaknesses = "Lacks any detail or supporting evidence.";
    advice = "In an interview, try to follow the 'What, Why, and How' structure for every answer.";
  } else if (!isRelevant) {
    score = 1;
    summary = "Off-topic or non-technical.";
    strengths = "Good length.";
    weaknesses = "Uses non-professional language or unrelated examples.";
    advice = "Re-read the question carefully. Focus on technical tools, methodologies, and professional experiences.";
  } else if (trimmedAnswer.length < 60) {
    score = 3;
    summary = "Basic answer, lacks depth.";
    strengths = "Technically relevant and on-topic.";
    weaknesses = "Missing specific examples and professional depth.";
    advice = "Use the STAR method (Situation, Task, Action, Result) to make your experience more credible.";
  } else {
    score = 7;
    summary = "Solid professional effort.";
    strengths = "Good use of keywords and professional tone.";
    weaknesses = "Could benefit from more specific metrics or outcomes.";
    advice = "Mention specific tools (e.g., 'Docker', 'Jira', 'MDN') to show practical hands-on experience.";
  }

  // Combine into structured teacher-style feedback
  const aiFeedback = `EXAMINER REPORT:
----------------
SUMMARY: ${summary}
STRENGTHS: ${strengths}
AREAS FOR IMPROVEMENT: ${weaknesses}
TEACHER'S ADVICE: ${advice}

(Note: This is simulated feedback because a valid Gemini API key is missing).`;

  // 3. Map Question to High-Quality Ideal Answer
  let idealAnswer = "A comprehensive answer should cover technical depth, specific examples from past experience, and clear communication of the underlying concepts.";

  if (question.includes("core responsibilities")) {
    idealAnswer = "A strong answer should highlight both technical and collaborative aspects: 'My core responsibilities involve designing scalable architecture, writing clean and maintainable code, performing thorough code reviews, and collaborating with cross-functional teams to deliver user-centric features. I also prioritize technical debt management and mentoring junior developers.'";
  } else if (question.includes("challenging project")) {
    idealAnswer = "Use the STAR method: 'In my last project, we faced a performance bottleneck where API response times were exceeding 2 seconds. I led the transition from a monolithic to a microservices approach and implemented Redis caching. This resulted in a 60% reduction in latency and improved system stability under high load.'";
  } else if (question.includes("latest trends")) {
    idealAnswer = "Demonstrate continuous learning: 'I stay updated by following industry-leading blogs like Overreacted and Smashing Magazine, contributing to open-source projects on GitHub, and attending monthly tech meetups. I also regularly consult official documentation (like MDN or AWS docs) to stay current with the latest API changes.'";
  } else if (question.includes("conflict")) {
    idealAnswer = "Focus on professionalism and resolution: 'I once disagreed with a peer regarding our database schema. Instead of escalating, I scheduled a technical deep-dive where we mapped out the pros and cons of both approaches. We eventually agreed on a hybrid solution that met both our scalability and performance requirements.'";
  } else if (question.includes("debugging")) {
    idealAnswer = "Show a systematic process: 'I follow a structured approach: First, I reproduce the issue and isolate the environment. Then, I use tools like Chrome DevTools, server-side logs (ELK stack), and unit tests to pinpoint the root cause. Once fixed, I always implement a regression test to ensure the bug doesn't resurface.'";
  }

  return {
    score,
    aiFeedback,
    idealAnswer
  };
};

module.exports = {
  generateQuestions,
  evaluateAnswer,
};
