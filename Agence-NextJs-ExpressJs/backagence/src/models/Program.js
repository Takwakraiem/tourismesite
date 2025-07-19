const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProgramStatusEnum = ['DRAFT', 'PUBLISHED', 'ARCHIVED']; 

const programSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    maxParticipants: {
      type: Number,
      default: 12,
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ProgramStatusEnum,
      default: 'DRAFT',
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
      required: true,
    },

    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProgramImage',
      },
    ],
    itinerary: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ItineraryDay',
      },
    ],
    includes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProgramInclude',
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProgramLike',
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    programguide : [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProgramGuide',
      },
    ],
  },
  {
    collection: 'programs',
    timestamps: true,
  }
);

module.exports = mongoose.model('Program', programSchema);
