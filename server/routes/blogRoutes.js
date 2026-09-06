const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');

const { authenticate, authorize } = require('../middleware/auth');

router.route('/')
  .get(getBlogs)
  .post(authenticate, authorize('admin'), createBlog);

router.route('/:id')
  .get(getBlogById)
  .put(authenticate, authorize('admin'), updateBlog)
  .delete(authenticate, authorize('admin'), deleteBlog);

module.exports = router;
