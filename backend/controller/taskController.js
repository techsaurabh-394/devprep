const Task = require("../models/taskModel");

// Get all tasks for the authenticated user, grouped by status
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    const groupedTasks = {
      todo: tasks.filter((task) => task.status === "todo"),
      inProgress: tasks.filter((task) => task.status === "inProgress"),
      completed: tasks.filter((task) => task.status === "completed"),
    };
    res.json(groupedTasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

// Add a new task
const addTask = async (req, res) => {
  try {
    const { content, status, priority, dueDate } = req.body;
    const newTask = new Task({
      user: req.user._id,
      content,
      status,
      priority,
      dueDate,
    });

    await newTask.save();

    // Fetch all tasks to return the updated grouped tasks
    const allTasks = await Task.find({ user: req.user._id });
    const groupedTasks = {
      todo: allTasks.filter((task) => task.status === "todo"),
      inProgress: allTasks.filter((task) => task.status === "inProgress"),
      completed: allTasks.filter((task) => task.status === "completed"),
    };
    res.status(201).json(groupedTasks);
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(400).json({ message: "Error adding task" });
  }
};

// Delete a task by ID
const deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if the task belongs to the user
    if (task.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this task" });
    }

    await Task.findByIdAndDelete(taskId);

    // Return updated grouped tasks
    const allTasks = await Task.find({ user: req.user._id });
    const groupedTasks = {
      todo: allTasks.filter((task) => task.status === "todo"),
      inProgress: allTasks.filter((task) => task.status === "inProgress"),
      completed: allTasks.filter((task) => task.status === "completed"),
    };
    res.json(groupedTasks);
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ message: "Error deleting task" });
  }
};

// Update task
const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const updates = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if the task belongs to the user
    if (task.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this task" });
    }

    // Update the task
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $set: updates },
      { new: true }
    );

    // Return updated grouped tasks
    const allTasks = await Task.find({ user: req.user._id });
    const groupedTasks = {
      todo: allTasks.filter((task) => task.status === "todo"),
      inProgress: allTasks.filter((task) => task.status === "inProgress"),
      completed: allTasks.filter((task) => task.status === "completed"),
    };
    res.json(groupedTasks);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Error updating task" });
  }
};

module.exports = {
  getTasks,
  addTask,
  deleteTask,
  updateTask,
};
