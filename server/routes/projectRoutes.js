const express = require("express");
const router = express.Router();
const { getProjects, create_user_project } = require("../controllers/projectController");
const { verifytoken } = require("../middleware/verifytoken");

router.route("/").get(verifytoken, getProjects).post(verifytoken, create_user_project);

module.exports = router;
