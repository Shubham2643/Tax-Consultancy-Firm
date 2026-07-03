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

router.route('/').get(getNavMenu).post(createNavMenuItem);
router.route('/all').get(getAllNavMenu);
router.route('/:id').get(getNavMenuItem).put(updateNavMenuItem).delete(deleteNavMenuItem);

module.exports = router;
