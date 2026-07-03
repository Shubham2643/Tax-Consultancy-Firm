const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { authenticate, authorize } = require('../middleware/auth');

// Public routes
router.get('/', teamController.getTeamMembers);

// Admin-only CRUD routes
router.get('/admin', authenticate, authorize('admin'), teamController.getAllTeamMembers);
router.post('/', authenticate, authorize('admin'), teamController.createTeamMember);
router.put('/:id', authenticate, authorize('admin'), teamController.updateTeamMember);
router.delete('/:id', authenticate, authorize('admin'), teamController.deleteTeamMember);

module.exports = router;
