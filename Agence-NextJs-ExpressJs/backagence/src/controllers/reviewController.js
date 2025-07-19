const { default: mongoose } = require("mongoose");
const Program = require("../models/Program");
const { Review } = require("../models/Review");

exports.createReview = async (req, res) => {
  try {
    const { rating, comment, userId, programId } = req.body;
    if (!rating || !comment || !userId || !programId) {
      return res.status(400).json({ error: "Champs requis manquants." });
    }
    const newReview = new Review({ rating, comment, userId, programId });
    await newReview.save();
    await Program.findByIdAndUpdate(programId, {
      $push: { reviews: newReview._id },
    });
    const reviews = await Review.find({ programId: new mongoose.Types.ObjectId(programId) });
    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);

    await Program.findByIdAndUpdate(programId, {
      rating: averageRating.toFixed(1), 
    });
    res.status(201).json(newReview);
  } catch (err) {
    console.error("Erreur lors de l'ajout d'une review :", err);
    res.status(500).json({ error: err.message });
  }
};
exports.getReviewsByProgram = async (req, res) => {
  try {
    const { programId } = req.params;

    const reviews = await Review.find({ programId })
      .populate("userId", "name") 
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({ error: "Review non trouvée." });
    }
    await Program.findByIdAndUpdate(review.programId, {
      $pull: { reviews: review._id },
    });
    const reviews = await Review.find({ programId: review.programId });
    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);

    await Program.findByIdAndUpdate(review.programId, {
      rating: reviews.length > 0 ? averageRating.toFixed(1) : 0,
    });

    res.json({ message: "Review supprimée avec succès." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const updated = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, comment },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Review non trouvée." });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
