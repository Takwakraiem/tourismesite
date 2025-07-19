const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/mailer");
const crypto = require("crypto");
const userService = {
  register: async (userData) => {
    const { name, email, password, country } = userData;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email déjà utilisé");
    }
    const user = new User({
      name,
      email,
      password,
      country,
      verification_token: crypto.randomBytes(32).toString("hex"),
      is_verified: false,
    });
    await user.save();
    const verifyLink = `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/verify-email?token=${user.verification_token}`;

    await sendEmail(
      email,
      "Vérifiez votre compte",
      `
            <h3>Bienvenue !</h3>
            <p>Merci de vous être inscrit. Veuillez vérifier votre adresse en cliquant ci-dessous :</p>
            <a href="${verifyLink}">Vérifier mon email</a>
        `
    );

    return { message: "Utilisateur créé. Vérifiez votre email." };
  },
  registerByAdmin: async (userData) => {
    const { name, email, password, country, role } = userData;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email déjà utilisé");
    }
    const user = new User({
      name,
      email,
      password,
      role,
      country,
      verification_token: null,
      is_verified: true,
    });
    await user.save();
    return { message: "Utilisateur créé." };
  },
  updateUser: async (id, userData) => {
    try {
      const { name, email, country, role } = userData;

      const existingUser = await User.findById(id);
      if (!existingUser) {
        throw new Error("Utilisateur non trouvé");
      }

      existingUser.name = name ?? existingUser.name;
      existingUser.email = email ?? existingUser.email;
      existingUser.country = country ?? existingUser.country;
      existingUser.role = role ?? existingUser.role;
      const updatedUser = await existingUser.save();

      return {
        message: "Utilisateur mis à jour.",
        user: updatedUser,
      };
    } catch (err) {
      throw new Error(`Erreur lors de la mise à jour: ${err.message}`);
    }
  },
  verifyEmail: async (token) => {
    const user = await User.findOne({ verification_token: token });
    if (!user) throw new Error("Token invalide");
    user.is_verified = true;
    user.verification_token = null; 
    await user.save();
    return { message: "Email vérifié avec succès." };
  },
  login: async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }
    if (!user.is_verified) throw new Error("Email non vérifié");
     if (user.is_activated) throw new Error("Compte non trouve");
    const isValidPassword = await user.isPasswordValid(password);
    if (!isValidPassword) {
      throw new Error("Mot de passe incorrect");
    }
    const token = jwt.sign(
      { id: user._id, email: user.email,role:user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return {
      token,
      role: user.role,
      mail: user.email,
    };
  },
  findByEmail: async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }
    return user;
  },
  findByAll: async () => {
    const users = await User.find().populate("country","name");
    if (!users) {
      return [];
    }
    return users;
  },
  findALLUSER: async () => {
    const users = await User.find({role:"USER"}).populate("country","name");
    if (!users) {
      return [];
    }
    return users;
  },
  findById: async (id) => {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }
    return user;
  },
  findByrole: async () => {
    const user = await User.findOne({ role: "ADMIN" });
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }
    return user;
  },
  deleted: async (id) => {
    const user = await User.findById(id);
    user.is_activated = !user.is_activated;
    await user.save();
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }
    return user;
  },
};

module.exports = userService;
