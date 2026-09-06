const express = require('express');
const router = express.Router();
const {
  getNavMenu,
  getAllNavMenu,
  getNavMenuItem,
  createNavMenuItem,
  updateNavMenuItem,
  deleteNavMenuItem,
} = require('../controllers/navMenuController');

const { authenticate, authorize } = require('../middleware/auth');

router.route('/')
  .get(getNavMenu)
  .post(authenticate, authorize('admin'), createNavMenuItem);

router.route('/all')
  .get(authenticate, authorize('admin'), getAllNavMenu);

router.route('/:id')
  .get(getNavMenuItem)
  .put(authenticate, authorize('admin'), updateNavMenuItem)
  .delete(authenticate, authorize('admin'), deleteNavMenuItem);

module.exports = router;
