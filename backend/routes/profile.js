const express = require("express");
const router = express.Router();
const {
  getProfile,
  createOrUpdateProfile,
} = require("../controller/profileController");
const auth = require("../middleware/auth");

// Get user profile
router.get("/", auth, getProfile);

// Create or update profile
router.post("/", auth, createOrUpdateProfile);

module.exports = router;
