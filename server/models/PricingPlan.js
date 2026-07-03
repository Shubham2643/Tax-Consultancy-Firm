const mongoose = require('mongoose');

const pricingPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Plan name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Plan price is required'],
    },
    period: {
      type: String,
      required: [true, 'Plan period is required'],
      trim: true,
    },
    features: {
      type: [String],
      required: [true, 'At least one feature is required'],
    },
    isPopular: {
      type: Boolean,
      default: false,
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

pricingPlanSchema.index({ order: 1 });

module.exports = mongoose.model('PricingPlan', pricingPlanSchema);
