const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const { User } = require("../models/User");

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ["user:email"], // ✅ Make sure to request email access
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // GitHub may return multiple emails, ensure at least one exists
        const emailObj = profile.emails && profile.emails[0];
        if (!emailObj || !emailObj.value) {
          return done(new Error("Email not available from GitHub"), null);
        }

        const email = emailObj.value;

        let user = await User.findOne({ email });

        if (!user) {
          user = new User({
            username: profile.username || profile.displayName || "github-user",
            email: email,
            password: profile.id, // Or generate a random string, this field is unused
          });
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Required if using sessions, otherwise not needed
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
