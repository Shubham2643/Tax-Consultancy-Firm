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

router.route('/').get(getPricingPlans).post(createPricingPlan);
router.route('/all').get(getAllPricingPlans);
router.route('/:id').get(getPricingPlan).put(updatePricingPlan).delete(deletePricingPlan);

module.exports = router;
