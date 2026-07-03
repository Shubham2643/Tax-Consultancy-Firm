const { validationResult } = require('express-validator');
const ContactInquiry = require('../models/ContactInquiry');
const notificationService = require('../services/notificationService');

// @desc    Submit a contact inquiry
// @route   POST /api/contact
// @access  Public
const createInquiry = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const inquiry = await ContactInquiry.create(req.body);

    // Trigger Notification Integrations asynchronously
    // 1. Email alerts (Admin and Client confirmation)
    notificationService.sendEmails(inquiry);

    // 2. SMS alert
    const smsMessage = `Hello ${inquiry.name}, thank you for contacting Shree Chamunda Associates regarding: ${inquiry.service || 'Tax Services'}. We will review your request and get back to you shortly.`;
    notificationService.sendSMS(inquiry.phone, smsMessage);

    // 3. Browser Push Notification
    notificationService.sendPushNotification(
      'New Inquiry Received!',
      `Client "${inquiry.name}" is interested in: ${inquiry.service || 'General Consulting'}`
    );

    // 4. Real-time Socket.io message
    notificationService.sendRealTimeMessage(req.io, 'inquiry_received', {
      message: `Inquiry received from ${inquiry.name} for ${inquiry.service || 'General Consultation'}`,
      inquiry
    });

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been submitted successfully. We will get back to you soon!',
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Get all contact inquiries
// @route   GET /api/contact
// @access  Admin
const getInquiries = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    const total = await ContactInquiry.countDocuments(query);
    const inquiries = await ContactInquiry.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: inquiries.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: inquiries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single contact inquiry
// @route   GET /api/contact/:id
// @access  Admin
const getInquiry = async (req, res, next) => {
  try {
    const inquiry = await ContactInquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found',
      });
    }
    res.status(200).json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update inquiry status
// @route   PUT /api/contact/:id
// @access  Admin
const updateInquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const inquiry = await ContactInquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found',
      });
    }

    // Trigger update notifications
    notificationService.sendRealTimeMessage(req.io, 'inquiry_updated', {
      message: `Inquiry status updated to ${status}`,
      inquiry
    });

    notificationService.sendPushNotification(
      'Inquiry Status Updated',
      `Your inquiry for "${inquiry.service || 'Consultation'}" status is now: ${status}`
    );

    res.status(200).json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete inquiry
// @route   DELETE /api/contact/:id
// @access  Admin
const deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await ContactInquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInquiry,
  getInquiries,
  getInquiry,
  updateInquiryStatus,
  deleteInquiry,
};
