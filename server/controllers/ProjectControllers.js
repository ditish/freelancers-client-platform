
const project = require("../model/project");


// get project from user
const getproject = async (req, res) => {
   
  try {
    const user_project = await project.find({ user: req.user._id })
    
    if (!user_project) {
      return res.status(400).json({ success: 'fail', message: "project not found" });
    }
    return res.status(200).json({ success: "true", message: "project found", user_project })
  
  } catch (error) {
    return res.status(400).json({ success: 'fail', message: error.message });
  }
}
// creating new project
const create_user_project = async (req, res) => {
  try {
   
    const { name, client, status, deadline } = req.body;
    const project = new project({
      name,
      client,
      status,
      deadline,
      user: req.user._id,
    })
    await project.save();
    return res.status(200).json({ success: "true", message: "project created", create_user_project })
  
  } catch (error) {
    
   return res.status(400).json({ success: 'fail', message: error.message });
  }
}
 module.exports ={getproject,create_user_project}


  
 