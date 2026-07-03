const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Service description is required'],
      trim: true,
    },
    icon: {
      type: String,
      required: [true, 'Service icon is required'],
      trim: true,
    },
    link: {
      type: String,
      default: '#',
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    detailedOverview: {
      type: String,
      default: '',
      trim: true,
    },
    deliverables: {
      type: [String],
      default: [],
    },
    documentsRequired: {
      type: [String],
      default: [],
    },
    timeline: {
      type: String,
      default: '3-5 working days',
      trim: true,
    },
    serviceType: {
      type: String,
      default: 'general',
      enum: ['tax', 'startup', 'accounting', 'registration', 'general'],
    },
    governmentFee: {
      type: Number,
      default: 0,
    },
    professionalFee: {
      type: Number,
      default: 0,
    },
    eligibility: {
      type: [String],
      default: [],
    },
    keyBenefits: {
      type: [String],
      default: [],
    },
    processSteps: [
      {
        step: Number,
        title: String,
        description: String,
      },
    ],
    faqs: [
      {
        question: String,
        answer: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

serviceSchema.index({ order: 1 });

module.exports = mongoose.model('Service', serviceSchema);
