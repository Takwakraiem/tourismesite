const mongoose = require("mongoose");
const { Schema } = mongoose;

const guideSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    specialty: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },

    rating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    experience: {
      type: Number,
      default: 0,
    },

    languages: [
      {
        type: String,
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },

    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },

    programguide: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProgramGuide",
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GuideReview",
      },
    ],
  },
  {
    collection: "guides",
    timestamps: true, 
  }
);

module.exports = mongoose.model("Guide", guideSchema);
