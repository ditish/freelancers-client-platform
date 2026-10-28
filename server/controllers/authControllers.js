const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

/* ================= SIGNUP ================= */
const signup = async (req, res) => {
  try {
    const { name, email, password, role, skills, clientType, companyName } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }
    const isCompany = role === "client" && clientType === "company";
if (isCompany && !companyName?.trim()) {
  return res.status(400).json({ message: "Company name is required" });
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
           ...(role === "client"
        ? {
            clientType: isCompany ? "company" : "individual",
            ...(isCompany && { companyName: companyName.trim() }),
          }
        : { skills }),
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
    const { email,role } = req.body;

    const user = await User.findOne({ email,role });
    if (!user) {
      return res.status(404).json({ success: false, message: "Email not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log("this is otp from the mailtrap", otp);
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
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
    console.log("otp error",error)
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= VERIFY OTP ================= */
const verifyOtpAndResetPassword = async (req, res) => {
  try {
    const { email, role, otp, newPassword } = req.body;

    if (!email || !role || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    console.log("this is otp form the user", otp);
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check OTP exists at all
    if (!user.otp) {
      return res.status(400).json({ success: false, message: "No OTP requested. Please request a new one" });
    }

    // Check expiry
    if (user.otpExpiry < Date.now()) {
      user.otp = null;
      user.otpExpiry = null;
      await user.save();
      return res.status(400).json({ success: false, message: "OTP expired. Please request a new one" });
    }

    // Check OTP match
    // If you stored OTP as plaintext:
    if (String(user.otp )!==String(otp)) {
      console.log("invalid otp")
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // If you hashed the OTP instead (recommended), use this instead of the line above:
    // const isOtpValid = await bcrypt.compare(otp, user.otp);
    // if (!isOtpValid) {
    //   return res.status(400).json({ success: false, message: "Invalid OTP" });
    // }

    // Hash and set new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear OTP fields so it can't be reused
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.status(200).json({ success: true, message: "Password reset successful" });

  } catch (error) {
    console.log("there is err in verifyotp", error);
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
  verifyOtpAndResetPassword,
  getUserProfile,
  getAllclient,
  googleLogin
  
};
