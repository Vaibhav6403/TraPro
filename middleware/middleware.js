
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 


const authenticateToken = (req, res, next) => {

  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No Token Provided.' });
  }


  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or Expired Token.' });
    }
    req.user = decoded;
    next();
  });
};


const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Permission Denied. Admins Only.' });
  }
  next();
};

module.exports = { authenticateToken, authorizeAdmin };
