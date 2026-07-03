const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');
const { authenticate } = require('../middleware/auth');
const Session = require('../models/Session');

// Helper to optionally get user from header session token
const getOptionalUser = async (req) => {
  try {
    let token = req.query.token;
    const authHeader = req.headers.authorization;
    if (!token && authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    if (token) {
      const session = await Session.findOne({ token, expiresAt: { $gt: new Date() } });
      return session ? session.userId : null;
    }
  } catch (e) {
    // Ignore session lookup errors
  }
  return null;
};

// POST /api/consultations/book
router.post('/book', async (req, res, next) => {
  try {
    const { name, email, phone, date, timeSlot, serviceType, notes } = req.body;
    if (!name || !email || !date || !timeSlot || !serviceType) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const clientId = (await getOptionalUser(req)) || req.body.clientId || null;

    const booking = await Consultation.create({
      client: clientId,
      name,
      email,
      phone,
      date,
      timeSlot,
      serviceType,
      notes,
      status: 'pending',
    });

    // Broadcast Socket Event
    if (req.io) {
      req.io.emit('consultation_booked', booking);
    }

    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
});

// GET /api/consultations/client
router.get('/client', authenticate, async (req, res, next) => {
  try {
    const bookings = await Consultation.find({
      $or: [
        { client: req.user._id },
        { email: req.user.email },
      ],
    }).sort({ date: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
});

// GET /api/consultations/admin
router.get('/admin', authenticate, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    const bookings = await Consultation.find({}).sort({ date: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
});

// PUT /api/consultations/admin/:id
router.put('/admin/:id', authenticate, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    const { status, date, timeSlot } = req.body;
    const updateObj = {};
    if (status) updateObj.status = status;
    if (date) updateObj.date = date;
    if (timeSlot) updateObj.timeSlot = timeSlot;

    const booking = await Consultation.findByIdAndUpdate(
      req.params.id,
      updateObj,
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Broadcast Socket Event
    if (req.io) {
      req.io.emit('consultation_updated', booking);
    }

    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
