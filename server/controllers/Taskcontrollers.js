const Project = require("../model/project");
const Task = require("../model/task");

// Get all tasks for a user
exports.getTasks = async (req, res) => {
  let tasks;
  try {
      if (req.user.role == "client") {
        tasks = await Task.find({ client: req.user._id })
          .populate('assignedTo', "name email")
        .populate("projectId", "title")
      }
       if (req.user.role == "freelancer") {
        tasks = await Task.find({assignedTo: req.user._id })
          .populate('client', "name email")
        .populate("projectId", "title")
    }
    const totalTasks = tasks.length;
    return res.status(200).json({ success: "true", message: "project found", tasks, totalTasks });
    
  } catch (error) {
    console.log("this is getask message", error);
    return res.status(400).json({ success: 'fail', message: error.message })
   
  }
  
};

 exports.getTaskbyProject= async (req,res) => {
   try {
       const userId = req.user._id
    const tasks = await Task.find({ projectId: req.params.projectId ,assignedTo:userId});
 
    if (tasks.length === 0 ) {
      return res.status(400).json({ sucess: true, message: "task not created" });
    }
   
      return res.status(200).json({ tasks })
    

  } catch (error) {
    console.log("there is err", error)
      return res.status(400).json({ success: false, message: error.message })
  }
}

// Create a new task
exports.createTask = async (req, res) => {

  try {
     const { title, projectId, status, deadline, assignedTo } = req.body;

  const task = await Task.create({
    title,
    projectId,
    status,
    deadline,
    assignedTo,
    client: req.user._id,
  });

    if (assignedTo) {
      await Project.findByIdAndUpdate(
        projectId,
        {
          $addToSet: { freelancer: assignedTo },
        }
      );
    }

    console.log("this is assigned freelancer", assignedTo);

  res.status(201).json(task);
    
  } catch (error) {
     console.log("there is err", error)
      return res.status(400).json({ success: false, message: error.message })
  }
 
};

exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findByIdAndUpdate(
      taskId, 
      req.body, 
      { new: true }  // 👈 returns updated task
    );
    console.log("this is updated task", req.body)
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ success: true, message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.assignDirectTasks = async (req, res) => {
  try {
    const { taskIds, assignedTo } = req.body;

    // update all selected tasks at once
    await Task.updateMany(
      { _id: { $in: taskIds } },        //  find all selected tasks
      { $set: { assignedTo } }           //  set new freelancer
    );

    res.status(200).json({ success: true, message: "Tasks assigned successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
