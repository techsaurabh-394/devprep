const express = require("express");
const router = express.Router();
const { signUp, signIn } = require("../controller/authController");
require("../config/passport");
require("../config/passport-github");
const passport = require("passport");

// Local auth
router.post("/signup", signUp);
router.post("/signin", signIn);

// Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const token = req.user.generateAuthToken();
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
  }
);

// GitHub login
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    const token = req.user.generateAuthToken();
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
  }
);

module.exports = router;
