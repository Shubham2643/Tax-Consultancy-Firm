const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    heroTitle: { type: String, default: '', trim: true },
    heroSubtitle: { type: String, default: '', trim: true },
    heroDescription: { type: String, default: '', trim: true },
    phone: { type: String, default: '', trim: true },
    email: { type: String, default: '', trim: true },
    address: { type: String, default: '', trim: true },
    workingHours: { type: String, default: '', trim: true },
    companyDescription: { type: String, default: '', trim: true },
    trustMainText: { type: String, default: '', trim: true },
    trustDescription: { type: String, default: '', trim: true },
    trustDescription2: { type: String, default: '', trim: true },
    socialLinks: {
      linkedin: { type: String, default: '', trim: true },
      instagram: { type: String, default: '', trim: true },
      facebook: { type: String, default: '', trim: true },
      whatsapp: { type: String, default: '', trim: true },
      twitter: { type: String, default: '', trim: true },
    },
    offerItems: { type: [String], default: [] },
    quickLinks: [
      {
        label: { type: String, trim: true },
        url: { type: String, trim: true },
      },
    ],
    importantLinks: [
      {
        label: { type: String, trim: true },
        url: { type: String, trim: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
