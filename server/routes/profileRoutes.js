const express = require("express");
const router = express.Router();

const { getProfile, updateProfile, updateAvatar } = require("../controllers/profileControllers");
const { verifyToken } = require("../middleware/verifytoken");
const { upload } = require("../middleware/upload");

router.get("/me", verifyToken, getProfile);
router.put("/me", verifyToken, updateProfile);
router.put("/me/avatar", verifyToken, upload.single("avatar"), updateAvatar);

module.exports = router;