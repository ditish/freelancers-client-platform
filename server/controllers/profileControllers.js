// // controllers/profileController.js
// import { v2 as cloudinary } from "cloudinary";
// import User from "../models/User.js";
// import Project from "../models/Project.js";

// const EDITABLE = ["name","headline","bio","location","skills","education","companyName","website"];

// export const getProfile = async (req, res) => {
//   try {
//     const userId = req.params.id || req.user._id;
//     const user = await User.findById(userId).select("-password -resetOtp -resetOtpExpiry");
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // adjust field names to your Project schema
//     const filter = user.role === "freelancer" ? { freelancerId: user._id } : { clientId: user._id };
//     const [total, completed, ongoing] = await Promise.all([
//       Project.countDocuments(filter),
//       Project.countDocuments({ ...filter, status: "completed" }),
//       Project.countDocuments({ ...filter, status: "ongoing" }),
//     ]);
//     const recent = await Project.find({ ...filter, status: "completed" })
//       .sort({ updatedAt: -1 }).limit(6).select("title description updatedAt");

//     res.json({ user, stats: { total, completed, ongoing }, recentProjects: recent });
//   } catch (e) { res.status(500).json({ message: e.message }); }
// };

// export const updateProfile = async (req, res) => {
//   try {
//     const updates = {};
//     EDITABLE.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
//     const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true })
//       .select("-password");
//     res.json(user);
//   } catch (e) { res.status(500).json({ message: e.message }); }
// };

// export const updateAvatar = async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: "No file" });
//     const user = await User.findById(req.user._id);
//     if (user.avatar?.publicId) await cloudinary.uploader.destroy(user.avatar.publicId);

//     const result = await new Promise((resolve, reject) => {
//       cloudinary.uploader.upload_stream({ folder: "avatars" }, (err, r) => (err ? reject(err) : resolve(r)))
//         .end(req.file.buffer);
//     });
//     user.avatar = { url: result.secure_url, publicId: result.public_id };
//     await user.save();
//     res.json(user.avatar);
//   } catch (e) { res.status(500).json({ message: e.message }); }
// };