const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

/* ================= SIGNUP ================= */
const signup = async (req, res) => {
  try {
    const { name, email, password, role, skills, company } = req.body;
    console.log(name,email,password,role)

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const existingUser = await User.findOne({ email ,role});
    if (existingUser) {
      return res.status(400).json({ success: false, message: `email already exist as ${role}` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

     const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
       role,
       skills,
      company
    });
     

    return res.status(201).json({
      success: true, message: "Signup successful",
     user: {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role
  }
     });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { idToken, role } = req.body;

    if (!idToken || !role) {
      return res.status(400).json({ success: false, message: "idToken and role are required" });
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email, role });

    if (!user) {
      user = await User.create({
        name,
        email,
        role,
        googleId,
        authProvider: "google",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    return res.status(200).json({
      success: true,
      message: "Google login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    console.log("this is google login error", error.message);
  }
};


/* ================= LOGIN ================= */
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email,role });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false
    });

    return res.status(200).json({
      success: true, message: "Login successful",
  user: {          // optionally send user info
   id: user._id,
     name: user.name,
    email: user.email,
    role:user.role
   }
     });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    console.log("this is login error", error.message);
  }
};

   const logOut = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });

   return res.json({ message: "Logged out" });
};


/* ================= GET USER ================= */
const getuser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getAllclient = async (req, res) => {
  try {
    const client = await User.find({role:"client"}).select("-password");
    if (!client) {
           return res.status(404).json({ success: false, message: "no client are found" });
    }
    const totalClient = client.length;
     res.status(200).json({ success: true, client,totalClient});
  } catch (error) {
     res.status(500).json({ success: false, message: error.message });
  }
}



/* ================= RESET PASSWORD ================= */
const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Email not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    user.otp = otp;
    await user.save();

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    await transporter.sendMail({
      to: email,
      subject: "OTP for password reset",
      html: `<h3>Your OTP is ${otp}</h3>`
    });

    res.status(200).json({ success: true, message: "OTP sent" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= VERIFY OTP ================= */
const verifyOtp = async (req, res) => {
  try {
    const { otp, newpassword } = req.body;

    const hashedPassword = await bcrypt.hash(newpassword, 10);

    const user = await User.findOneAndUpdate(
      { otp },
      { password: hashedPassword, otp: null }
    );

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    res.status(200).json({ success: true, message: "Password updated" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getUserProfile = async (req, res) => {
  if (req.user) {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};



module.exports = {
  signup,
  login,
  logOut,
  getuser,
  resetPassword,
  verifyOtp,
  getUserProfile,
  getAllclient,
  googleLogin
  
};
