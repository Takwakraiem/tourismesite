const mongoose = require('mongoose');
const { Schema } = mongoose;

const itineraryDaySchema = new Schema(
  {
    day: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
      required: true,
    },
  },
  {
    collection: 'itinerary_days',
    timestamps: true,
  }
);

module.exports = mongoose.model('ItineraryDay', itineraryDaySchema);
