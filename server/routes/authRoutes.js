const {
  signup,
  resetPassword,
  verifyOtp,
  getuser,
  login,
  logOut,
  getUserProfile,

} = require("../controllers/authControllers.js")
const { verifyToken } = require("../middleware/verifytoken")
const express = require("express")
const router = express.Router();
router.get("/me", verifyToken, getUserProfile);
router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.post("/auth/logOut", logOut);
router.get("/auth/getuser",verifyToken, getuser);
router.post("/auth/resetPassword", resetPassword);
router.post("/auth/verifyotp", verifyOtp);

module.exports = router;