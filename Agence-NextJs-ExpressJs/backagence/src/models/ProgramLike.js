const mongoose = require('mongoose');
const { Schema } = mongoose;
const programLikeSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
      required: true,
    },
  },
  {
    collection: 'program_likes',
    timestamps: { createdAt: true, updatedAt: false },
  }
);

module.exports.ProgramLike = mongoose.model('ProgramLike', programLikeSchema);
