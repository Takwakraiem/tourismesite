
const mongoose = require("mongoose");
const { Schema } = mongoose;

const guideReviewSchema = new Schema(
  {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    guideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guide", 
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: "guide_reviews", 
  }
);

module.exports = mongoose.model("GuideReview", guideReviewSchema);
