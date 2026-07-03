const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createInquiry,
  getInquiries,
  getInquiry,
  updateInquiryStatus,
  deleteInquiry,
} = require('../controllers/contactController');

// Validation rules for contact form
const contactValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[+]?[\d\s-]{10,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters'),
  body('service')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Service name is too long'),
];

router.route('/').get(getInquiries).post(contactValidation, createInquiry);
router.route('/:id').get(getInquiry).put(updateInquiryStatus).delete(deleteInquiry);

module.exports = router;
