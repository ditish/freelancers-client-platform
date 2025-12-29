const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

/* ================= SIGNUP ================= */
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword
    });

    return res.status(201).json({ success: true, message: "Signup successful" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= LOGIN ================= */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
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

    return res.status(200).json({ success: true, message: "Login successful" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET USER ================= */
const getuser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

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
  getuser,
  resetPassword,
  verifyOtp,
  getUserProfile
};
