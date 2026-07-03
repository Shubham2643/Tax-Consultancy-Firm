const mongoose = require('mongoose');

const contactInquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    service: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['new', 'in-progress', 'resolved', 'closed'],
      default: 'new',
    },
    comments: [
      {
        senderName: { type: String, required: true },
        senderRole: { type: String, required: true }, // 'client' or 'admin'
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      }
    ],
  },
  {
    timestamps: true,
  }
);

contactInquirySchema.index({ createdAt: -1 });
contactInquirySchema.index({ status: 1 });

module.exports = mongoose.model('ContactInquiry', contactInquirySchema);
