const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');
const { authenticate } = require('../middleware/auth');
const Session = require('../models/Session');

// Helper to optionally get user from header session token
const getOptionalUser = async (req) => {
  try {
    const authHeader = req.headers.authorization;
    let token = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
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

    const clientId = await getOptionalUser(req);

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

    // Emit to admin room and user room if client is authenticated
    if (req.io) {
      req.io.to('admin').emit('consultation_booked', booking);
      if (clientId) {
        req.io.to(`user:${clientId}`).emit('consultation_booked', booking);
      }
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

    // Emit to admin room and user room if applicable
    if (req.io) {
      req.io.to('admin').emit('consultation_updated', booking);
      if (booking.client) {
        req.io.to(`user:${booking.client.toString()}`).emit('consultation_updated', booking);
      }
    }

    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
