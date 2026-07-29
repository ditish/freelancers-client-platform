const User = require("../model/user");
 const Project = require("../model/project");
 const getFreelancer = async (req, res) => {
  try {
    const freelancers =  await User.find({ role: "freelancer" })
    if (!freelancers) {
      return res.status(404).json({ success:false, message: "no freelancer found" }) 
    }
    return res.status(200).json({ success: true , message:"freelancer found",freelancers})
    
  } catch (error) {

     return res.status(500).json({ success: false , message:"this is error:",error})
  }
}



const getFreelancerProfile = async (req, res) => {
  try {
    const freelancerId = req.params.id;

    // 1. Find freelancer
    const freelancer = await User.findById(freelancerId)
      .select("-password");

    if (!freelancer || freelancer.role !== "freelancer") {
      return res.status(404).json({
        success: false,
        message: "Freelancer not found",
      });
    }

    // 2. Get freelancer projects
    const projects = await Project.find({
      freelancer: freelancer._id,
    });

    // 3. Send response
    res.status(200).json({
      success: true,
      freelancer,
      stats: {
        totalProjects: projects.length,
        completed: projects.filter(p => p.status === "Completed").length,
        ongoing: projects.filter(p => p.status === "Ongoing").length,
      },
    });

  } catch (error) {
    console.log('err',error)
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getClientProfile = async (req, res) => {
  try {
    const clientId = req.params.id;

    // 1. Find client
    const client = await User.findById(clientId)
      .select("-password");

    if (!client || client.role !== "client") {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // 2. Get client's projects
    const projects = await Project.find({
      client: client._id,
    });

    // 3. Send response
    res.status(200).json({
      success: true,
      client,
      stats: {
        totalProjects: projects.length,
        completed: projects.filter(p => p.status === "Completed").length,
        pending: projects.filter(p => p.status === "Pending").length,
      },
    });

  } catch (error) {
    console.log('err', error)
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



module.exports = {
  getFreelancer,
  getFreelancerProfile,
  getClientProfile
}