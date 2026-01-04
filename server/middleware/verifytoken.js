const jwt = require('jsonwebtoken')
const User = require("../model/user.js")
const verifyToken = async (req, res, next) => { 
  const token = req.cookies.token || '';
  if (!token) {
    return res.status(401).json({ success: 'fail', message: 'No token provided' });
  }
  try
  {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password")
    
    req.user = {
      _id: user.id,
      role: user.role,
      name: user.name,
        email: user.email,
     }
    console.log(req._id)
    next();
  } catch (error) {
    return res.status(401).json({ success: 'fail', message: 'Invalid token' });
  }
}
module.exports = {verifyToken}