const { Comment } = require("../models/Comment");
exports.createComment = async (req, res) => {
  try {
    const { content, userId, programId } = req.body;

    if (!content || !userId || !programId) {
      return res.status(400).json({ error: "Champs requis manquants." });
    }

    const comment = new Comment({ content, userId, programId });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Le contenu ne peut pas être vide." });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { content },
      { new: true, runValidators: true }
    );

    if (!updatedComment) {
      return res.status(404).json({ error: "Commentaire introuvable." });
    }

    res.status(200).json(updatedComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getCommentsByProgram = async (req, res) => {
  try {
    const programId = req.params.programId;
    const comments = await Comment.find({ programId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;

    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) return res.status(404).json({ error: "Commentaire introuvable." });

    res.status(200).json({ message: "Commentaire supprimé." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
