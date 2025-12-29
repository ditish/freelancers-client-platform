const {verifyToken}= require("../middleware/verifytoken")
const {
  signup,
  resetPassword,
  verifyOtp,
  getuser,
  login,
} = require("./controllers/Authcontrollers");
 router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.get("/auth/getuser",verifyToken, getuser);
router.post("/auth/resetPassword", resetPassword);
router.post("/auth/verifyotp", verifyOtp);