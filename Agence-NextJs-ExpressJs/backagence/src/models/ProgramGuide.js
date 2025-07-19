const mongoose = require('mongoose');
const { Schema } = mongoose;

const programGuideSchema = new Schema(
  {
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
      required: true,
    },
    guideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Guide',
      required: true,
    },
  },
  {
    collection: 'program_guides',
    timestamps: true,
  }
);

const ProgramGuide = mongoose.model('ProgramGuide', programGuideSchema);

module.exports = {
  ProgramGuide
};
