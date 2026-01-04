const Task = require("../model/task");

// Get all tasks for a user
exports.getTasks = async (req, res) => {
  let tasks;
  try {
      if (req.role == "clinet") {
        tasks = await Task.find({ client: req.user._id }).populate("client", "name email")
          .populate('freelancer', "name email")
        .populate("project ", "tittle")
      }
       if (req.role == "freelancer") {
        tasks = await Task.find({freelancer: req.user._id }).populate("client", "name email")
          .populate('freelancer', "name email")
        .populate("project ", "tittle")
    }
     return res.status(200).json({ success: "true", message: "project found", tasks })
    
  } catch (error) {
       return res.status(400).json({ success: 'fail', message: error.message })
  }
  
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
