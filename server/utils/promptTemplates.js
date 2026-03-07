const generateQuestionsPrompt = (role, country, experience) => {
  return `Act as an expert technical interviewer. Generate 5 challenging interview questions for a ${role} position in ${country} with ${experience} years of experience.
  The questions should cover technical skills, problem-solving, and role-specific scenarios.
  
  Return the response in a JSON format as an array of objects with the key "questions". 
  Example:
  {
    "questions": [
      { "question": "What is the difference between let and const in JavaScript?" },
      ...
    ]
  }
  Do not include any other text in your response, only the JSON.`;
};

const evaluateAnswerPrompt = (question, answer, role, experience) => {
  return `Act as a strict senior technical interviewer and teacher for a ${role} with ${experience} years of experience.
  Evaluate the following answer to the technical question: "${question}".
  
  User's Answer: "${answer}"
  
  Critical Evaluation Criteria:
  - If the answer is extremely short, vague, or irrelevant, give a score of 0-2.
  - A score of 8-10 should only be given for answers that show deep technical understanding and professional context.
  - Be critical and educational.

  Provide the "aiFeedback" in the following structured format:
  EXAMINER REPORT:
  ----------------
  SUMMARY: [One sentence judgment]
  STRENGTHS: [What they did well]
  AREAS FOR IMPROVEMENT: [What was missing]
  TEACHER'S ADVICE: [Practical tips for next time]

  Return the response in a JSON format with keys: "score", "aiFeedback", and "idealAnswer".
  Do not include any other text in your response, only the JSON.`;
};

module.exports = {
  generateQuestionsPrompt,
  evaluateAnswerPrompt,
};
