const express = require('express');
const router = express.Router();
const {
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
} = require('../controllers/faqController');

const { authenticate, authorize } = require('../middleware/auth');

router.route('/')
  .get(getFAQs)
  .post(authenticate, authorize('admin'), createFAQ);

router.route('/:id')
  .put(authenticate, authorize('admin'), updateFAQ)
  .delete(authenticate, authorize('admin'), deleteFAQ);

module.exports = router;
