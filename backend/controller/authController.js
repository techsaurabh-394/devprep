const { User, validateUser } = require("../models/User");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  const { username, email, password } = req.body;

  const { error } = validateUser({ username, email, password });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token, userId: user._id, username: user.username });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, userId: user._id, username: user.username });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { signUp, signIn };
