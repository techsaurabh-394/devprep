import axios from "axios";

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;

// Generate 15 interview questions for a given role using Google AI API
export const generateQuestions = async (req, res) => {
  const role = req.body.role;

  if (!role) {
    return res.status(400).json({ message: "Role is required" });
  }

  if (!GOOGLE_AI_API_KEY) {
    console.error("GOOGLE_AI_API_KEY is not set");
    return res
      .status(500)
      .json({ message: "Server configuration error: API key missing" });
  }

  try {
    // Example prompt to generate questions
    const prompt =
      "Generate 15 interview questions for the role of " +
      role +
      ". Include basic concepts, role-specific technical questions, and soft-skill or scenario-based questions.";

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1500,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + GOOGLE_AI_API_KEY,
        },
      }
    );

    const questionsText = response.data.choices[0].message.content;
    // Split questions by line breaks or numbering
    const questions = questionsText
      .split(/\n|\d+\.\s*/)
      .map((q) => q.trim())
      .filter((q) => q.length > 0);

    res.json({ questions });
  } catch (error) {
    console.error("Error generating questions:", error.message);
    res
      .status(500)
      .json({ message: "Failed to generate questions", error: error.message });
  }
};

// Evaluate recorded answers using Google AI speech-to-text and NLP
export const evaluateAnswers = async (req, res) => {
  const answers = req.body.answers;

  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ message: "Answers array is required" });
  }

  if (!GOOGLE_AI_API_KEY) {
    console.error("GOOGLE_AI_API_KEY is not set");
    return res
      .status(500)
      .json({ message: "Server configuration error: API key missing" });
  }

  try {
    // For simplicity, assume answers is an array of text answers
    // In real implementation, you might process audio files with speech-to-text API first

    // Example: send answers to Google AI API for evaluation and scoring
    const prompt =
      "Evaluate the following interview answers for relevance, technical correctness, clarity, and completeness. Provide a score out of 15 and feedback for each answer:\n\n" +
      answers.map((a, i) => i + 1 + ". " + a).join("\n");

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1500,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + GOOGLE_AI_API_KEY,
        },
      }
    );

    const evaluationText = response.data.choices[0].message.content;

    res.json({ evaluation: evaluationText });
  } catch (error) {
    console.error("Error evaluating answers:", error.message);
    res
      .status(500)
      .json({ message: "Failed to evaluate answers", error: error.message });
  }
};
