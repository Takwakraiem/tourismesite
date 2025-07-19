const mongoose = require('mongoose');
const { Schema } = mongoose;

const programIncludeSchema = new Schema(
  {
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
    collection: 'program_includes',
    timestamps: true,
  }
);
programIncludeSchema.pre('remove', async function (next) {
  await mongoose.model('ProgramInclude').deleteMany({ programId: this._id });
  next();
});

module.exports = mongoose.model('ProgramInclude', programIncludeSchema);
