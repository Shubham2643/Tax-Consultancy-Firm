const express = require('express');
const router = express.Router();
const {
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
} = require('../controllers/faqController');

router.route('/').get(getFAQs).post(createFAQ);
router.route('/:id').put(updateFAQ).delete(deleteFAQ);

module.exports = router;
