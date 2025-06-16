const express = require("express");
const router = express.Router();
const { generateQuestions, evaluateAnswers } = require("../controller/interviewController");

// Generate interview questions based on role and job description
router.post("/generate-questions", generateQuestions);

// Evaluate answers and provide feedback
router.post("/evaluate-answers", evaluateAnswers);

module.exports = router;
