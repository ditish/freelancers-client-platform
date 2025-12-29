const Task = require("../model/task");

// Get all tasks for a user
exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.user._id }).populate("project", "name");
  res.json(tasks);
};

// Create a new task
exports.createTask = async (req, res) => {
  const { title, project, status, deadline, assignedTo } = req.body;

  const task = await Task.create({
    title,
    project,
    status,
    deadline,
    assignedTo,
  });

  res.status(201).json(task);
};
