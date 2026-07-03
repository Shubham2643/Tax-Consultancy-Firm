const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
    },
    summary: {
      type: String,
      required: [true, 'Blog summary is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Blog content is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Blog category is required'],
      trim: true,
    },
    author: {
      type: String,
      default: 'Shree Chamunda Associates',
      trim: true,
    },
    readTime: {
      type: String,
      default: '5 min read',
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: '/assets/banner_screenshot.png',
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

blogPostSchema.index({ createdAt: -1 });
blogPostSchema.index({ category: 1 });

module.exports = mongoose.model('BlogPost', blogPostSchema);
