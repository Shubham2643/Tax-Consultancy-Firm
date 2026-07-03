const NavMenu = require('../models/NavMenu');

// @desc    Get all active nav menu items
// @route   GET /api/navmenu
// @access  Public
const getNavMenu = async (req, res, next) => {
  try {
    const menuItems = await NavMenu.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all nav menu items (including inactive) for admin
// @route   GET /api/navmenu/all
// @access  Admin
const getAllNavMenu = async (req, res, next) => {
  try {
    const menuItems = await NavMenu.find().sort({ order: 1 });
    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single nav menu item
// @route   GET /api/navmenu/:id
// @access  Admin
const getNavMenuItem = async (req, res, next) => {
  try {
    const menuItem = await NavMenu.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }
    res.status(200).json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create nav menu item
// @route   POST /api/navmenu
// @access  Admin
const createNavMenuItem = async (req, res, next) => {
  try {
    const menuItem = await NavMenu.create(req.body);
    res.status(201).json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update nav menu item
// @route   PUT /api/navmenu/:id
// @access  Admin
const updateNavMenuItem = async (req, res, next) => {
  try {
    const menuItem = await NavMenu.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }
    res.status(200).json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete nav menu item
// @route   DELETE /api/navmenu/:id
// @access  Admin
const deleteNavMenuItem = async (req, res, next) => {
  try {
    const menuItem = await NavMenu.findByIdAndDelete(req.params.id);
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNavMenu,
  getAllNavMenu,
  getNavMenuItem,
  createNavMenuItem,
  updateNavMenuItem,
  deleteNavMenuItem,
};
