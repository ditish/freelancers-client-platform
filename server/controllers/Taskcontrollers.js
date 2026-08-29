const Notification = require("../model/notification");
const Project = require("../model/project");
const Task = require("../model/task");
const { getConnectedUsers } = require("../socket");

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
    // fetching task for geting clinet name 
     const populatedTask = await Task.findById(task._id).populate("client", "name email");

    console.log("this is assigned freelancer", assignedTo);
    const freelancerId = task.assignedTo;
       const notification = await Notification.create({
         userId: freelancerId, // ← notify this client
         
      message: ` Task:"${task.title}" is assigned to you which  created by  Client:"${populatedTask.client.name}"`,
      type: "task",
      isRead: false,
       });
    console.log("this is notification while creating the new task", notification);
    const freelancerSocketId = getConnectedUsers()[freelancerId.toString()];
    if (freelancerSocketId) {
      io.to(freelancerSocketId).emit("newNotification", notification);
    }

  res.status(201).json(task);
    
  } catch (error) {
     console.log("there is err", error)
      return res.status(400).json({ success: false, message: error.message })
  }
 
};

exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
      const { oldFreelancerId, ...updateFields } = req.body; 

    const task = await Task.findByIdAndUpdate(
      taskId, 
      updateFields, 
      { new: true }  // 👈 returns updated task
    );

    console.log("this is updated task", updateFields);

    if (!task) return res.status(404).json({ message: "Task not found" });

     // only run the cleanup check if this update actually changed the assignee
    if (oldFreelancerId && updateFields.assignedTo && oldFreelancerId !== String(updateFields.assignedTo)) {
      const remainingTasks = await Task.find({
        projectId: task.projectId,
        assignedTo: oldFreelancerId,
      });
      console.log("this is remaing task", remainingTasks);
     if (remainingTasks.length === 0) {
        // Step 1: remove the old freelancer
        await Project.findByIdAndUpdate(task.projectId, {
          $pull: { freelancer: oldFreelancerId }, // 👈 correct field name
        });
      }

      // Step 2: add the new freelancer (separate call, uses $addToSet to avoid duplicates)
      await Project.findByIdAndUpdate(task.projectId, {
        $addToSet: { freelancer: updateFields.assignedTo }, // 👈 correct field name + correct source
      });
    }
    res.status(200).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // validate status value
    if (!["Pending", "Completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    
 
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { status },        // ← only update status field
      { new: true }      // ← return updated document
    )
       if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const clientId = updatedTask.client; 
    console.log("this is clientID of task", clientId);

      // create notification in DB
    const notification = await Notification.create({
      userId:clientId, // ← notify this client
      message: `Task "${updatedTask.title}" marked as ${status}`,
      type: "task",
      isRead: false,
    });
 
      // send real-time notification if client is online
    const clientSocketId = getConnectedUsers()[clientId.toString()];
    if (clientSocketId) {
      io.to(clientSocketId).emit("newNotification", notification);
    }


     return res.status(200).json(updatedTask);

  } catch (error) {
    console.log("full error", error);
     return res.status(500).json({ message: "Server error", error: error.message });
  }
};

 

exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });
    const { assignedTo, projectId } = task;
     if (assignedTo) {
      const remainingTasks = await Task.find({
        projectId,
        assignedTo,
      });

      if (remainingTasks.length === 0) {
        await Project.findByIdAndUpdate(projectId, {
          $pull: { freelancer: assignedTo }, // remove them from the project's freelancer list
        });
      }
    } res.status(200).json({ success: true, message: "Task deleted" });
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
};

