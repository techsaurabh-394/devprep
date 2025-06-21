const express = require("express");
const router = express.Router();
const aiController = require("../controller/aiController");

// POST /api/ai/questions - Generate interview questions based on profile
router.post("/questions", aiController.generateQuestions);

// POST /api/ai/feedback - Generate feedback for a given answer
router.post("/feedback", aiController.generateFeedback);

module.exports = router;
