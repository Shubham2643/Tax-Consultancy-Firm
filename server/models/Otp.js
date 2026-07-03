const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
  target: {
    type: String,
    required: true,
    index: true,
  },
  otpCode: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  }
});

// Create a TTL index to delete OTP records automatically after their expiry date/time
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Otp', OtpSchema);
