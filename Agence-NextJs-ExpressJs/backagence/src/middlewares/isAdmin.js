const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    if (user.role !== "ADMIN") {
      return res.status(403).json({ message: "Accès réservé aux administrateurs" });
    }
    next();
  } catch (error) {
    console.error("Erreur dans le middleware isAdmin:", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};
