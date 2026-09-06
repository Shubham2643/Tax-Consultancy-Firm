const express = require('express');
const router = express.Router();
const {
  getFeatures,
  getAllFeatures,
  getFeature,
  createFeature,
  updateFeature,
  deleteFeature,
} = require('../controllers/featureController');

const { authenticate, authorize } = require('../middleware/auth');

router.route('/')
  .get(getFeatures)
  .post(authenticate, authorize('admin'), createFeature);

router.route('/all')
  .get(authenticate, authorize('admin'), getAllFeatures);

router.route('/:id')
  .get(getFeature)
  .put(authenticate, authorize('admin'), updateFeature)
  .delete(authenticate, authorize('admin'), deleteFeature);

module.exports = router;
