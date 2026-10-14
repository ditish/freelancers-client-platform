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
const getClients = async (req, res) => {
  try {
    const clients =  await User.find({ role: "client" })
    if (!clients) {
      return res.status(404).json({ success:false, message: "no clients found" }) 
    }
    return res.status(200).json({ success: true , message:"client found",clients})
    
  } catch (error) {

     return res.status(500).json({ success: false , message:"this is error:",error})
  }
}
 





module.exports = {
  getFreelancer,
  getClients
}