const express = require("express");
const {
  getTasks,
  addTask,
  deleteTask,
  updateTask,
} = require("../controller/taskController");
const auth = require("../middleware/auth");

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Get all tasks for the authenticated user
router.get("/", getTasks);

// Add a new task
router.post("/", addTask);

// Delete a task
router.delete("/:taskId", deleteTask);

// Update task
router.put("/:taskId", updateTask);

module.exports = router;
