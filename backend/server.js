require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./config/db");
const session = require("express-session");
const passport = require("./config/passport");

// Routes
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

const profileRoutes = require("./routes/profile");
const taskRoutes = require("./routes/taskRoutes");
const interviewRoutes = require("./routes/interview");
const aiRoutes = require("./routes/ai");

// MongoDB Connection
connection().catch((err) => {
  console.error("Failed to connect to MongoDB:", err);
  process.exit(1);
});

app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: process.env.JWT_SECRET || "devprepsecret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes); // ✅ Now /api/auth/signup and /signin work
app.use("/api/profile", profileRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/ai", aiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
