const { generateQuestions, evaluateAnswer } = require("../../services/geminiService");
const config = require("../../config");

describe("Gemini Service", () => {
  test("should generate questions", async () => {
    const questions = await generateQuestions("Software Engineer", "USA", 5);
    expect(Array.isArray(questions)).toBe(true);
    expect(questions.length).toBeGreaterThan(0);
    expect(questions[0]).toHaveProperty("question");
  });

  test("should evaluate an answer", async () => {
    const evaluation = await evaluateAnswer(
      "What is React?",
      "React is a JavaScript library for building user interfaces.",
      "Software Engineer",
      5
    );
    expect(evaluation).toHaveProperty("score");
    expect(evaluation).toHaveProperty("aiFeedback");
    expect(evaluation).toHaveProperty("idealAnswer");
  });
});
