const PricingPlan = require('../models/PricingPlan');

// @desc    Get all active pricing plans
// @route   GET /api/pricing
// @access  Public
const getPricingPlans = async (req, res, next) => {
  try {
    const plans = await PricingPlan.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all pricing plans (including inactive) for admin
// @route   GET /api/pricing/all
// @access  Admin
const getAllPricingPlans = async (req, res, next) => {
  try {
    const plans = await PricingPlan.find().sort({ order: 1 });
    res.status(200).json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single pricing plan
// @route   GET /api/pricing/:id
// @access  Public
const getPricingPlan = async (req, res, next) => {
  try {
    const plan = await PricingPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Pricing plan not found',
      });
    }
    res.status(200).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create pricing plan
// @route   POST /api/pricing
// @access  Admin
const createPricingPlan = async (req, res, next) => {
  try {
    const plan = await PricingPlan.create(req.body);
    res.status(201).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update pricing plan
// @route   PUT /api/pricing/:id
// @access  Admin
const updatePricingPlan = async (req, res, next) => {
  try {
    const plan = await PricingPlan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Pricing plan not found',
      });
    }
    res.status(200).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete pricing plan
// @route   DELETE /api/pricing/:id
// @access  Admin
const deletePricingPlan = async (req, res, next) => {
  try {
    const plan = await PricingPlan.findByIdAndDelete(req.params.id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Pricing plan not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Pricing plan deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPricingPlans,
  getAllPricingPlans,
  getPricingPlan,
  createPricingPlan,
  updatePricingPlan,
  deletePricingPlan,
};
