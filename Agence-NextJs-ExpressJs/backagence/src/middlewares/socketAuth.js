const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require('dotenv');
dotenv.config();
exports.protectSocket = async (socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) return next(new Error("Token manquant"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) throw new Error("Utilisateur non trouvé");

    socket.user = user;
    next();
  } catch (err) {
    next(new Error("Authentification échouée"));
  }
};
