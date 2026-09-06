const express = require('express');
const router = express.Router();
const {
  getServices,
  getAllServices,
  getService,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');

const { authenticate, authorize } = require('../middleware/auth');

router.route('/')
  .get(getServices)
  .post(authenticate, authorize('admin'), createService);

router.route('/all')
  .get(authenticate, authorize('admin'), getAllServices);

router.route('/:id')
  .get(getService)
  .put(authenticate, authorize('admin'), updateService)
  .delete(authenticate, authorize('admin'), deleteService);

module.exports = router;
