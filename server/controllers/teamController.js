const TeamMember = require('../models/TeamMember');

// @desc    Get all active team members (Public)
// @route   GET /api/team
exports.getTeamMembers = async (req, res) => {
  try {
    const members = await TeamMember.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, data: members });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server Error' });
  }
};

// @desc    Get all team members including drafts (Admin)
// @route   GET /api/admin/team
exports.getAllTeamMembers = async (req, res) => {
  try {
    const members = await TeamMember.find({}).sort({ order: 1 });
    res.json({ success: true, data: members });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server Error' });
  }
};

// @desc    Create a new team member (Admin)
// @route   POST /api/team
exports.createTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.create(req.body);
    res.status(201).json({ success: true, data: member });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || 'Bad Request' });
  }
};

// @desc    Update a team member (Admin)
// @route   PUT /api/team/:id
exports.updateTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }
    res.json({ success: true, data: member });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || 'Bad Request' });
  }
};

// @desc    Delete a team member (Admin)
// @route   DELETE /api/team/:id
exports.deleteTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }
    res.json({ success: true, message: 'Team member successfully deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server Error' });
  }
};
