 const jwt = require('jsonwebtoken');
module.exports.verifyToken = (req, res, next) => { 
  const token = req.cookies.token || '';
  if (!token) {
    return res.status(401).json({ success: 'fail', message: 'No token provided' });
  }
  try
  {
    const decoded = jwt .verify(token, process.env.JWT_SECRET);
    req._id = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ success: 'fail', message: 'Invalid token' });
  }
}
