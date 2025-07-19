const mongoose = require('mongoose');
const { Schema } = mongoose;

const countrySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
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
    image: {
      type: String,
      required: true,
    },
    programs: [
    
      {  type: mongoose.Schema.Types.ObjectId,
        ref: 'Program',
       
      }
    ],
    guides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guide',
      },
    ],
  },
  {
    collection: 'countries', 
    timestamps: true, 
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model('Country', countrySchema);
