const { default: mongoose } = require("mongoose");
const Guide = require("../models/Guide");
const GuideReview = require("../models/GuideReview");
exports.createGuideReview = async (req, res) => {
  try {
    const { rating, comment, userId, guideId } = req.body;

    const review = new GuideReview({ rating, comment, userId, guideId });
    await review.save();
    await Guide.findByIdAndUpdate(guideId, {
      $push: { reviews: review._id },
    });
    const reviews = await GuideReview.find({ guideId: new mongoose.Types.ObjectId(guideId) });
    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);

    await Guide.findByIdAndUpdate(guideId, {
      rating: averageRating.toFixed(1), 
    });
    res.status(201).json(review);
  } catch (err) {  
    res.status(500).json({ error: "Erreur création review" });
  }
};
exports.getAllGuideReviews = async (req, res) => {
  try {
    const reviews = await GuideReview.find().populate("guideId").populate("userId");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Erreur récupération reviews" });
  }
};
exports.getReviewsByGuide = async (req, res) => {
  try {
    const { guideId } = req.params;
    const reviews = await GuideReview.find({ guideId }).populate("userId");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Erreur récupération des reviews du guide" });
  }
};

exports.updateGuideReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const updated = await GuideReview.findByIdAndUpdate(
      id,
      { rating, comment },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Review non trouvée" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Erreur mise à jour" });
  }
};
exports.deleteGuideReview = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await GuideReview.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Review non trouvée" });
    await Guide.findByIdAndUpdate(deleted.guideId, {
      $pull: { reviews: deleted._id },
    });
    const reviews = await GuideReview.find({ guideId: deleted.guideId });
    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);

    await Guide.findByIdAndUpdate(deleted.guideId, {
      rating: reviews.length > 0 ? averageRating.toFixed(1) : 0,
    });

    res.json({ message: "Review supprimée" });
  } catch (err) {
    res.status(500).json({ error: "Erreur suppression review" });
  }
};
