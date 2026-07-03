const mongoose = require('mongoose');
const Service = require('../models/Service');

// @desc    Get all active services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res, next) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all services (including inactive) for admin
// @route   GET /api/services/all
// @access  Admin
const getAllServices = async (req, res, next) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
const getService = async (req, res, next) => {
  try {
    let service;
    const param = req.params.id;

    if (mongoose.Types.ObjectId.isValid(param)) {
      service = await Service.findById(param);
    } else {
      // Prefer explicit slug field, then fall back to title-based slug match
      service = await Service.findOne({ slug: param.toLowerCase() });

      if (!service) {
        // Fall back to title-based slug match, allowing dashes or spaces
        const pattern = `^${param.replace(/-/g, '[- ]')}$`;
        service = await Service.findOne({
          title: { $regex: new RegExp(pattern, 'i') },
        });
      }
    }

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }
    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create service
// @route   POST /api/services
// @access  Admin
const createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Admin
const updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }
    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Admin
const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServices,
  getAllServices,
  getService,
  createService,
  updateService,
  deleteService,
};
