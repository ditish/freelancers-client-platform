const {
  signup,
  resetPassword,
  verifyOtpAndResetPassword,
  getuser,
  login,
  logOut,
  getUserProfile,
  getAllclient,
  googleLogin

} = require("../controllers/authControllers.js")
const { verifyToken } = require("../middleware/verifytoken")
const express = require("express")
const router = express.Router();
router.get("/me", verifyToken, getUserProfile);
router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.post("/auth/google", googleLogin);
router.post("/auth/logOut", logOut);
router.get("/auth/getuser",verifyToken, getuser);
router.post("/auth/resetPassword", resetPassword);
router.get("/auth/getAllclient", getAllclient);
router.post("/auth/verifyotp", verifyOtpAndResetPassword);

module.exports = router;