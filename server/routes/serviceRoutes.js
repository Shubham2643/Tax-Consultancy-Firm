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

router.route('/').get(getServices).post(createService);
router.route('/all').get(getAllServices);
router.route('/:id').get(getService).put(updateService).delete(deleteService);

module.exports = router;
