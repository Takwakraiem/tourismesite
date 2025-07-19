const mongoose = require('mongoose');
const { Schema } = mongoose;
const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
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
    collection: 'comments',
    timestamps: true,
  }
);

module.exports.Comment = mongoose.model('Comment', commentSchema);
