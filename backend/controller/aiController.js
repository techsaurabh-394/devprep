const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Generate interview questions based on user profile
exports.generateQuestions = async (req, res) => {
  try {
    const { profile } = req.body; // e.g., { role: 'frontend', experience: 2, language: 'JavaScript' }
    const prompt = `Generate 2 theory and 2 coding interview questions for a ${profile.role} developer with ${profile.experience} years experience in ${profile.language}. Questions should be professional and relevant.`;
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });
    const questions = response.data.choices[0].message.content;
    res.json({ questions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Generate feedback for a given answer
exports.generateFeedback = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const prompt = `You are a professional interviewer. Given the question: "${question}" and the candidate's answer: "${answer}", provide detailed, constructive feedback.`;
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    });
    const feedback = response.data.choices[0].message.content;
    res.json({ feedback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
