const generateQuestionsPrompt = (role, country, experience, resumeSkills = "") => {
  let resumeContext = "";
  if (resumeSkills) {
    resumeContext = `Specifically, tailor at least 3 questions to the following skills found in the user's resume: ${resumeSkills}. Focus on their practical application.`;
  }

  return `Act as an expert technical interviewer. Generate 5 challenging interview questions for a ${role} position in ${country} with ${experience} years of experience.
  The questions should cover technical skills, problem-solving, and role-specific scenarios.
  
  IMPORTANT: 
  - If the role is for a Software Developer, Engineer, or involves coding, include at least 2 coding challenges.
  - For coding challenges, provide a clear problem statement and a snippet of "initialCode" (e.g., a function signature).
  - Categorize each question as "theory" or "coding".
  
  ${resumeContext}
  
  Return the response in a JSON format as an array of objects with the key "questions". 
  Example:
  {
    "questions": [
      { 
        "question": "What is the difference between let and const in JavaScript?",
        "type": "theory",
        "initialCode": ""
      },
      {
        "question": "Write a function to find the first non-repeating character in a string.",
        "type": "coding",
        "initialCode": "function firstNonRepeatingChar(str) {\n  // Write your code here\n}"
      }
    ]
  }
  Do not include any other text in your response, only the JSON.`;
};

const evaluateAnswerPrompt = (question, answer, role, experience) => {
  return `Act as a strict senior technical interviewer and teacher for a ${role} with ${experience} years of experience.
  Evaluate the following response to the technical question: "${question}".
  
  Candidate's Response: "${answer}"
  
  Critical Evaluation Criteria:
  - If the question was a "coding challenge", evaluate the code for logic, efficiency (Time/Space Complexity), and edge cases.
  - If the question was "theory", evaluate for technical accuracy and depth.
  - If the answer is extremely short or irrelevant, give a score of 0-2.
  - A score of 8-10 should only be given for professional-grade responses.

  Provide the "aiFeedback" in the following structured format:
  EXAMINER REPORT:
  ----------------
  SUMMARY: [One sentence judgment]
  STRENGTHS: [What they did well]
  AREAS FOR IMPROVEMENT: [What was missing]
  TEACHER'S ADVICE: [Practical tips for next time]

  Return the response in a JSON format with keys: "score", "aiFeedback", "idealAnswer", and "followUp".
  - "followUp": (string, OPTIONAL. If the answer is good but could be explored deeper, ask one short, specific follow-up question. Otherwise leave as empty string).
  
  Do not include any other text in your response, only the JSON.`;
};

module.exports = {
  generateQuestionsPrompt,
  evaluateAnswerPrompt,
};
