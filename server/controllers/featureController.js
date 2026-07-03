const Feature = require('../models/Feature');

// @desc    Get all active features
// @route   GET /api/features
// @access  Public
const getFeatures = async (req, res, next) => {
  try {
    const features = await Feature.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json({
      success: true,
      count: features.length,
      data: features,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all features (including inactive) for admin
// @route   GET /api/features/all
// @access  Admin
const getAllFeatures = async (req, res, next) => {
  try {
    const features = await Feature.find().sort({ order: 1 });
    res.status(200).json({
      success: true,
      count: features.length,
      data: features,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single feature
// @route   GET /api/features/:id
// @access  Public
const getFeature = async (req, res, next) => {
  try {
    const feature = await Feature.findById(req.params.id);
    if (!feature) {
      return res.status(404).json({
        success: false,
        message: 'Feature not found',
      });
    }
    res.status(200).json({
      success: true,
      data: feature,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create feature
// @route   POST /api/features
// @access  Admin
const createFeature = async (req, res, next) => {
  try {
    const feature = await Feature.create(req.body);
    res.status(201).json({
      success: true,
      data: feature,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update feature
// @route   PUT /api/features/:id
// @access  Admin
const updateFeature = async (req, res, next) => {
  try {
    const feature = await Feature.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!feature) {
      return res.status(404).json({
        success: false,
        message: 'Feature not found',
      });
    }
    res.status(200).json({
      success: true,
      data: feature,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete feature
// @route   DELETE /api/features/:id
// @access  Admin
const deleteFeature = async (req, res, next) => {
  try {
    const feature = await Feature.findByIdAndDelete(req.params.id);
    if (!feature) {
      return res.status(404).json({
        success: false,
        message: 'Feature not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Feature deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFeatures,
  getAllFeatures,
  getFeature,
  createFeature,
  updateFeature,
  deleteFeature,
};
