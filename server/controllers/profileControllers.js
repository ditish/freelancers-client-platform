// controllers/profileController.js
const cloudinary = require("../config/cloudinary");
const User = require("../model/user");
const Project = require("../model/project");

const EDITABLE = ["name", "headline", "bio", "location", "skills", "education", "companyName", "website"];

const getProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user._id;
    console.log("this is id from getprofile", userId)
    const user = await User.findById(userId).select("-password -resetOtp -resetOtpExpiry");
    console.log("user is foud ", user);
    if (!user) return res.status(404).json({ message: "User not found" });

    // adjust field names to your Project schema
    const filter = user.role === "freelancer" ? { freelancerId: user._id } : { clientId: user._id };
    const [total, completed, ongoing] = await Promise.all([
      Project.countDocuments(filter),
      Project.countDocuments({ ...filter, status: "completed" }),
      Project.countDocuments({ ...filter, status: "ongoing" }),
    ]);
    const recent = await Project.find({ ...filter, status: "completed" })
      .sort({ updatedAt: -1 }).limit(6).select("title description updatedAt");

    res.json({ user, stats: { total, completed, ongoing }, recentProjects: recent });
  } catch (e) {
    res.status(500).json({ message: e.message });
    console.log("this is err form getprofile", e.message);
  }
};

const updateProfile = async (req, res) => {
  try {
    const updates = {};
    EDITABLE.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true })
      .select("-password");
    res.json(user);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

const updateAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const oldPublicId = user.avatar?.publicId;

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "avatars" }, (err, r) => (err ? reject(err) : resolve(r)))
        .end(req.file.buffer);
    });

    user.avatar = { url: result.secure_url, publicId: result.public_id };
    await user.save();

    // Only delete the old image after the new one is safely saved
    if (oldPublicId) {
      cloudinary.uploader.destroy(oldPublicId).catch(console.error);
    }

    res.json(user.avatar);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to update avatar" });
  }
};

module.exports = { getProfile, updateProfile, updateAvatar };