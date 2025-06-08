require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./config/db");

// Routes
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

const profileRoutes = require("./routes/profile");
const taskRoutes = require("./routes/taskRoutes");

// MongoDB Connection
connection().catch((err) => {
  console.error("Failed to connect to MongoDB:", err);
  process.exit(1);
});

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes); // ✅ Now /api/auth/signup and /signin work
app.use("/api/profile", profileRoutes);
app.use("/api/tasks", taskRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
