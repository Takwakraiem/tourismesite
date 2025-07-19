const { Message } = require("../models/Message");
const mongoose = require("mongoose");
exports.sendMessage = async (req, res) => {
  try {
    const { content, userId } = req.body;
    const senderId = req.user.id; 

    const message = new Message({
      content,
      sender: senderId,
      userId,
    });

    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'envoi du message", error: err.message });
  }
};

exports.getMessagesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const fromUserId = req.user.id;
    const messages = await Message.find({
      $or: [
        { sender: fromUserId, userId: userId },
        { sender: userId, userId: fromUserId },
      ],
    })
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des messages", error: err.message });
  }
};
exports.getMessages = async (req, res) => {
  try {
    const { toUserId } = req.params;
    const fromUserId = req.user.id;

    const messages = await Message.find({
      $or: [
        { sender: fromUserId, userId: toUserId },
        { sender: toUserId, userId: fromUserId },
      ],
    }).sort({ createdAt: 1 }).populate("sender", "name").populate("userId", "name");

    res.json(messages);
  } catch (error) {
    console.error("Erreur récupération messages :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findByIdAndUpdate(id, { isRead: true }, { new: true });

    if (!message) {
      return res.status(404).json({ message: "Message non trouvé" });
    }

    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du message", error: err.message });
  }
};
