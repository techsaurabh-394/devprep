require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./config/db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile");
const taskRoutes = require("./routes/taskRoutes");

if (!process.env.GOOGLE_AI_API_KEY) {
  console.warn("WARNING: GOOGLE_AI_API_KEY is NOT set.");
}

// Initialize MongoDB connection
connection().catch((err) => {
  console.error("Failed to connect to MongoDB:", err);
  process.exit(1);
});

app.use(express.json());
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/tasks", taskRoutes);

app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
