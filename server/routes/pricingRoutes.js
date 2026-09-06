const express = require('express');
const router = express.Router();
const {
  getPricingPlans,
  getAllPricingPlans,
  getPricingPlan,
  createPricingPlan,
  updatePricingPlan,
  deletePricingPlan,
} = require('../controllers/pricingController');

const { authenticate, authorize } = require('../middleware/auth');

router.route('/')
  .get(getPricingPlans)
  .post(authenticate, authorize('admin'), createPricingPlan);

router.route('/all')
  .get(authenticate, authorize('admin'), getAllPricingPlans);

router.route('/:id')
  .get(getPricingPlan)
  .put(authenticate, authorize('admin'), updatePricingPlan)
  .delete(authenticate, authorize('admin'), deletePricingPlan);

module.exports = router;
