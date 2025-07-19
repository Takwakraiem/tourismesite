const mongoose = require('mongoose');
const { Schema } = mongoose;
const messageSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    collection: 'messages',
    timestamps: { createdAt: true, updatedAt: false },
  }
);

module.exports.Message = mongoose.model('Message', messageSchema);
