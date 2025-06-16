const axios = require("axios");

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;
const GEMINI_API_KEY = process.env.YOUR_GEMINI_API_KEY;

// Generate interview questions based on role and job description
const generateQuestions = async (req, res) => {
  const { role, jobDescription, questionCount = 15 } = req.body;

  if (!role || !jobDescription) {
    return res
      .status(400)
      .json({ message: "Role and job description are required" });
  }

  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set");
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

// Evaluate recorded answers with detailed analysis
const evaluateAnswers = async (req, res) => {
  const { answers, questions, role, audioMetrics } = req.body;

  if (!answers || !Array.isArray(answers) || !questions || !role) {
    return res.status(400).json({
      message: "Answers array, questions, and role are required",
    });
  }

  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set");
    return res
      .status(500)
      .json({ message: "Server configuration error: API key missing" });
  }

  try {
    const analysisPromises = answers.map(async (answer, index) => {
      const prompt = `
      Role: ${role}
      Question: ${questions[index]}
      Answer: ${answer}
      Audio Metrics: ${JSON.stringify(audioMetrics?.[index] || {})}

      Provide a detailed evaluation in JSON format:
      {
        "score": number (0-10),
        "feedback": "detailed analysis",
        "technicalAccuracy": number (0-10),
        "communication": number (0-10),
        "confidence": number (0-10),
        "improvements": ["array of specific suggestions"],
        "keyPoints": ["array of good points made"],
        "missingPoints": ["array of important points missed"],
        "voiceAnalysis": {
          "pace": "analysis of speaking pace",
          "clarity": "analysis of speech clarity",
          "confidence": "analysis of speaking confidence"
        }
      }`;

      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
        {
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": GEMINI_API_KEY,
          },
        }
      );

      return response.data.candidates[0].content;
    });

    try {
      // Individual answer evaluations
      const analysisResults = await Promise.all(analysisPromises);

      // Generate overall evaluation
      const overallPrompt = `
        Role: ${role}
        Interview Performance Summary
        
        Analyzed responses: ${JSON.stringify(analysisResults)}
        
        Provide a comprehensive evaluation in JSON format:
        {
          "overallScore": number (0-100),
          "summary": "detailed performance summary",
          "technicalCompetency": number (0-100),
          "communicationSkills": number (0-100),
          "strengthsAndWeaknesses": {
            "strengths": ["array of key strengths"],
            "weaknesses": ["array of areas for improvement"]
          },
          "recommendations": ["array of specific recommendations"],
          "careerReadiness": "assessment of readiness for the role",
          "nextSteps": ["array of suggested next steps"]
        }`;

      const overallResponse = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
        {
          contents: [{ role: "user", parts: [{ text: overallPrompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": GEMINI_API_KEY,
          },
        }
      );

      const evaluation = {
        questionAnalysis: analysisResults,
        overallEvaluation: overallResponse.data.candidates[0].content,
      };

      res.json(evaluation);
    } catch (error) {
      console.error("Error evaluating answers:", error);
      res.status(500).json({
        message: "Failed to evaluate answers",
        error: error.message,
      });
    }
  } catch (error) {
    console.error("Error evaluating answers:", error.message);
    res
      .status(500)
      .json({ message: "Failed to evaluate answers", error: error.message });
  }
};

module.exports = {
  generateQuestions,
  evaluateAnswers,
};
