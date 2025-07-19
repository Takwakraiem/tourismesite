const { default: mongoose } = require("mongoose");
const { ProgramLike } = require("../models/ProgramLike");

exports.toggleLike = async (req, res) => {
  const { userId, programId } = req.body;

  try {
    const existingLike = await ProgramLike.findOne({ userId, programId });

    if (existingLike) {

      await ProgramLike.findByIdAndDelete(existingLike._id);
      return res.status(200).json({ liked: false, message: "Like retiré." });
    } else {
      const newLike = new ProgramLike({ userId, programId });
      await newLike.save();
      return res.status(201).json({ liked: true, message: "Like ajouté." });
    }
  } catch (err) {
    return res.status(500).json({ error: "Erreur serveur lors du like." });
  }
};

exports.getLikesByProgram = async (req, res) => {
  const { programId } = req.params;

  try {
    const likes = await ProgramLike.find({ programId });
    return res.status(200).json(likes);
  } catch (err) {
    return res.status(500).json({ error: "Erreur serveur lors du chargement des likes." });
  }
};

exports.checkUserLike = async (req, res) => {
  const { userId, programId } = req.params;

  if (!userId || !programId) {
    return res.status(400).json({ error: "userId et programId requis" });
  }

  try {
    const existingLike = await ProgramLike.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      programId: new mongoose.Types.ObjectId(programId),
    });

    res.json({ liked: !!existingLike });
  } catch (error) {
    console.error("Erreur check like:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

