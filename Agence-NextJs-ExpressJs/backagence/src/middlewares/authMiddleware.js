const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');
dotenv.config();
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(403).json({ message: 'Token manquant' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(403).json({ message: 'Token manquant' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token invalide ou expiré' });
  }
};

module.exports = authMiddleware;
