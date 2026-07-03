const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Feature title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Feature description is required'],
      trim: true,
    },
    icon: {
      type: String,
      required: [true, 'Feature icon is required'],
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

featureSchema.index({ order: 1 });

module.exports = mongoose.model('Feature', featureSchema);
