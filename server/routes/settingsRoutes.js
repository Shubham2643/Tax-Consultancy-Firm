const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings,
} = require('../controllers/settingsController');

const { authenticate, authorize } = require('../middleware/auth');

router.route('/')
  .get(getSettings)
  .put(authenticate, authorize('admin'), updateSettings);

module.exports = router;
