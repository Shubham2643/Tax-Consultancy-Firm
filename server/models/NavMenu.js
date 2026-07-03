const mongoose = require('mongoose');

const navMenuSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: [true, 'Menu label is required'],
      trim: true,
    },
    href: {
      type: String,
      default: '#',
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    children: [
      {
        label: {
          type: String,
          required: true,
          trim: true,
        },
        href: {
          type: String,
          default: '#',
          trim: true,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

navMenuSchema.index({ order: 1 });

module.exports = mongoose.model('NavMenu', navMenuSchema);
