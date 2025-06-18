const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const { User } = require("../models/User");

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if emails array exists and has at least one email
        const email =
          profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : null;
        if (!email) {
          return done(new Error("No email found in GitHub profile"), null);
        }
        let user = await User.findOne({ email: email });
        if (!user) {
          user = new User({
            username: profile.username || profile.displayName,
            email: email,
            password: profile.id,
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

module.exports = passport;
