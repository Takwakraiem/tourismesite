const mongoose = require('mongoose');
const { Schema } = mongoose;

const programImageSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
      required: true,
    },
  },
  {
    collection: 'program_images',
    timestamps: true,
  }
);

programImageSchema.pre('remove', async function(next) {
  await mongoose.model('ProgramImage').deleteMany({ programId: this._id });
  next();
});


module.exports = mongoose.model('ProgramImage', programImageSchema);
