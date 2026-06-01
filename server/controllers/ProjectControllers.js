
const { default: mongoose } = require("mongoose");
const Project = require("../model/project");
const Task = require("../model/task");


// get project from user
const getproject = async (req, res) => {
  let user_project;
  try {
    if (!req.user._id) {
      return res.status(404).json({sucess:fail,message:"user is not authenticate"})
    }
      if (req.user.role == "client") {
        user_project = await Project.find({ client: req.user._id }).populate("client", "name email")
          .populate('freelancer', "name email")
        
      }
       if (req.user.role == "freelancer") {
        user_project = await Project.find({freelancer: req.user._id }).populate("client", "name email")
          .populate('freelancer', "name email")
        
    }
    
   if (user_project.length === 0) {
      return res.status(200).json({ success: 'fail', message: "project not created yet" });
    }
    const projectsWithTaskCount = await Promise.all(
      user_project.map(async (project) => {
        const totalTask = await Task.countDocuments({ projectId: project._id })
           const tasks = await Task.find({ projectId: project._id })
      .populate("assignedTo", "name");
          const taskFreelancers = [...new Set(
        tasks
          .filter(t => t.assignedTo)
          .map(t => t.assignedTo.name)
      )];
        return { ...project.toObject(), totalTask,taskFreelancers };
      })
    );


    const totalProject = user_project.length;
    return res.status(200).json({ success: "true", message: "project found", user_project:projectsWithTaskCount , totalProject})
   


  } catch (error) {
    console.log("there is err while geting project",error)
    return res.status(400).json({ success: 'fail', message: error.message });
  }
}

const getProjectbyId = async (req, res) => {
 
  try {
  
    const project = await Project.findById(req.params.projectId)
    .populate("client", "name email");
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }
   return res.json({sucess:true,message:"project is ready", project , totalProject});


  } catch (error) {
      console.log("there is err while geting projectbyID",error)
    return res.status(400).json({ success: 'fail', message: error.message });
  }
}




// creating new project
const create_user_project = async (req, res) => {
  try {
   
    const { title,deadline,description } = req.body;
    const project = new Project({
      title,
      client:req.user._id,
      deadline,
      description,
      
    })
    await project.save();
    return res.status(200).json({ success: "true", message: "project created", project})
  
  } catch (error) {
    console.log("there is err while saving projects",error)
   return res.status(400).json({ success: 'fail', message: error.message });
  }
}

const deleteProjectbyId = async(req,res) => {
    try {
      const { projectId } = req.params;
      console.log("this is deleted", projectId);

       if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findByIdAndDelete(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
      }
      

    res.status(200).json({ message: "Project and related tasks deleted" });

    } catch (error) {
      console.log("there is problem while delteing the project", error);
    res.status(500).json({ message: error.message });
  }

}


module.exports = { getproject, getProjectbyId, create_user_project, deleteProjectbyId };


  
 