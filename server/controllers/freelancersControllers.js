const project = require("../model/project");
const user = require("../model/user");

const getMyClients = async (req, res) => {
  try {
    const clientIds = await project.distinct("client", {
      freelancer: req.user._id,   // if it's an array field, this still matches
    });
    const clients = await user.find({ _id: { $in: clientIds } })
      .select("name email avatar");
    res.json({ clients });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {  getMyClients };