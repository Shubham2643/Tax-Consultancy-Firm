const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Invoice = require('../models/Invoice');
const { authenticate } = require('../middleware/auth');

// POST /api/portal/payments/create-order — Initialize a Razorpay Order
router.post('/create-order', authenticate, async (req, res, next) => {
  try {
    const { invoiceId } = req.body;
    if (!invoiceId) {
      return res.status(400).json({ success: false, message: 'Invoice ID is required' });
    }

    // Find the invoice and verify ownership
    const invoice = await Invoice.findOne({ _id: invoiceId, client: req.user._id });
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found or unauthorized' });
    }

    if (invoice.status === 'paid') {
      return res.status(400).json({ success: false, message: 'Invoice is already paid' });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ success: false, message: 'Razorpay API credentials are missing from environment configurations' });
    }

    // Initialize Razorpay SDK instance
    const razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    // Create Razorpay Order (Amount is in Paise, 1 INR = 100 Paise)
    const options = {
      amount: Math.round(invoice.amount * 100),
      currency: 'INR',
      receipt: invoice.invoiceNumber,
      notes: {
        invoiceId: invoice._id.toString(),
        userId: req.user._id.toString()
      }
    };

    const order = await razorpayInstance.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/portal/payments/verify-signature — Validate Razorpay Signature and clear invoice
router.post('/verify-signature', authenticate, async (req, res, next) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, invoiceId } = req.body;
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !invoiceId) {
      return res.status(400).json({ success: false, message: 'Payment verification parameters and Invoice ID are required' });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ success: false, message: 'Razorpay API credentials are missing from environment configurations' });
    }

    // Verify Razorpay signature: SHA256 HMAC of (order_id + "|" + payment_id) using secret key
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature verification failed' });
    }

    // Update invoice status in database
    const invoice = await Invoice.findOneAndUpdate(
      { _id: invoiceId, client: req.user._id },
      { status: 'paid', paidAt: new Date() },
      { new: true }
    );

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found to clear' });
    }

    // Dispatch live websocket update
    if (req.io) {
      req.io.emit('invoice_paid', invoice);
    }

    res.json({
      success: true,
      message: 'Payment verified and invoice cleared successfully',
      data: invoice,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
