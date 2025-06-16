const express = require("express");
const router = express.Router();
const { signUp, signIn } = require("../controller/authController");
const passport = require("../config/passport");
const passportGithub = require("../config/passport-github");

router.post("/signup", signUp);
router.post("/signin", signIn);

// Google OAuth login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Generate JWT and send to frontend (or redirect with token)
    const token = req.user.generateAuthToken();
    // For SPA: redirect to frontend with token as query param
    res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/auth/success?token=${token}`);
  }
);

// GitHub OAuth login
router.get("/github", passportGithub.authenticate("github", { scope: ["user:email"] }));

// GitHub OAuth callback
router.get(
  "/github/callback",
  passportGithub.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    const token = req.user.generateAuthToken();
    res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/auth/success?token=${token}`);
  }
);

module.exports = router;
