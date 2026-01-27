
const Project = require("../model/project");


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
    
   if (!user_project) {
      return res.status(400).json({ success: 'fail', message: "project not created yet" });
    }
    return res.status(200).json({ success: "true", message: "project found", user_project })
  
  } catch (error) {
    console.log("there is err while geting project",error)
    return res.status(400).json({ success: 'fail', message: error.message });
  }
}
// creating new project
const create_user_project = async (req, res) => {
  try {
   
    const { title,deadline,freelancerId,description } = req.body;
    const project = new Project({
      title,
      client:req.user._id,
      deadline,
      freelancer: freelancerId,
      description,
      
    })
    await project.save();
    return res.status(200).json({ success: "true", message: "project created", project})
  
  } catch (error) {
    console.log("there is err while saving projects",error)
   return res.status(400).json({ success: 'fail', message: error.message });
  }
}
 module.exports ={getproject,create_user_project}


  
 