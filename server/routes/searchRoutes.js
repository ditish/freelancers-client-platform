const express = require("express");
const router = express.Router();
const { verifyToken} = require("../middleware/verifytoken");
const { searchUsers } = require("../controllers/searchControllers");

router.get("/searchUser", verifyToken, searchUsers);
module.exports = router;
