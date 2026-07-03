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

router.route('/').get(getFeatures).post(createFeature);
router.route('/all').get(getAllFeatures);
router.route('/:id').get(getFeature).put(updateFeature).delete(deleteFeature);

module.exports = router;
