const axios = require("axios");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function generateInterviewQuestions(role, country, experience) {

  const prompt = `
Generate 5 technical interview questions.

Role: ${role}
Country: ${country}
Experience: ${experience} years

The questions should be realistic and commonly asked in technical interviews.

Return the output as a numbered list.
`;

  try {

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      }
    );

    const text =
      response.data.candidates[0].content.parts[0].text;

    return text;

  } catch (error) {

    console.error("Gemini API error:", error.message);
    throw new Error("Failed to generate interview questions");

  }

}

module.exports = { generateInterviewQuestions };