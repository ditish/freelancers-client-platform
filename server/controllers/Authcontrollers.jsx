const User = require("../models/user")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer")
 const signup =  async(req,res) => {
  try {
    const { name, email, password } = req.body;
     if (!name || !email || !password) {
      return res.status(400).json({ success: "fail", message: "All fields are required" });
    }
    let user =  await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success:"fail",message:"user alreday exits"})
    }
    const securePassword = await bcrypt.hash(password, 10); 
    user = new User({
      name ,email, password: securePassword
    });
    await user.save();
return res.status(200).json({success:"true",message:"signup sucessfully"})

  } catch (error) {
    return res.status(400).json({ success: 'fail', message: error.message });
  }
}
const login = async (req,res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({success:"fail",message:"user not found ,please signup"})
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ success: "fail", message: "password not match please try again" });
    }
    // token created
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite:"lax"
      
    }).status(200).json({ success: "true", message: "login sucessfully"});  
  } catch (error) {
   return res.status(400).json({ success: 'fail', message: error.message });
  }
}
const getuser = async (req,res) => {
  try {
    const reqId = req._id;
    let user = await User.findById(reqId).select("-password")
    if (!user) {
      return res.status(400).json({ success: "fasle",  message:"user not found!"})
    }
return res.status(200).json({success:"true", message:"user found",user})

    
  } catch (error) {
    return res.status(400).json({ success: 'fail', message: error.message });
  }
}
 const resetPassword = async (res, req) => {
  const { email } = req.body;
  let user = User.findOne({email})
  try {
    if (!user) {
      res.status(400).json({success:"flase", message:"email not found"})
    }
 const generateOtp = Math.floor(Math.random()*10000)
    // Looking to send emails in production? Check out our Email API/SMTP product!
var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "63fa8104b447a0",
    pass: "8ff891e67c7163"
  }
});
  const info = await transporter.sendMail({
    from: 'acharyaditish@gmail.com',
    to: email,
    subject: "new otp is generetd",
  html: `<h3> your otp is :<i> ${generateOtp}</i></h3>`, // HTML body
  });
    if (info.messageId) {
      User.findOneAndUpdate({ email }, {
        $set:{
        otp: generateOtp
        }
      })
    }
     return res.status(200).json({ success: 'true', message:"otp is send"})
    
  } catch (error) {
    return res.status(400).json({ success: 'fail', message: error.message });
  }
  
  
}
 const verifyOtp = async (res, req) => {
  const { otp, newpassword } = req.body;
  try {
    const securePassword = await bcrypt.hash("newpassword", 10)
    const user = User.findOneAndUpdate({ otp }, {
      $set: {
        password: securePassword,
        otp: 0
      
      }
    }
    )
    if (!user) {
      return res.status(400).json({ success: 'fail', message: "user not found" });
    }
    return res.status(200).json({ success: 'true', message: "otp verifed"});
  }
    
  catch (error) {
    return res.status(400).json({ success: 'fail', message: error.message });
  }
}
module.exports= { signup,resetPassword,verifyOtp,getuser,login}
  