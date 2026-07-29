const user = require("../model/user");
const escapeRegex  = require("../utiles/escapeRegex");

// controllers/searchController.js
 const searchUsers = async (req, res) => {
  try {
    const { query, role } = req.query; // role = 'freelancer' | 'client' (required now)

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    const filter = { role };

    if (query && query.trim() !== "") {
        const safeQuery = escapeRegex(query.trim());
      const regex = new RegExp(safeQuery, "i");
      filter.$or = [
        { name: regex },
        { skills: { $in: [regex] } }
      ];
    }

    const results = await user.find(filter)
      .select("name  role skills ")
      .limit(10) // always cap at 10, whether it's the default list or a search
      .sort({ createdAt: -1 }); // default list shows most recent users first

    res.status(200).json({ results });
  } catch (err) {
    console.log("is there is err while searching", err)
    res.status(500).json({ message: "Search failed", error: err.message });
  }
};
module.exports = {
  searchUsers
}