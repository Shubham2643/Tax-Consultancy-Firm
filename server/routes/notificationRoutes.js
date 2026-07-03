const express = require('express');
const router = express.Router();
const PushSubscription = require('../models/PushSubscription');
const notificationService = require('../services/notificationService');

/**
 * @route   GET /api/notifications/vapid-key
 * @desc    Get VAPID public key for browser push registration
 * @access  Public
 */
router.get('/vapid-key', (req, res) => {
  const publicKey = notificationService.getVapidPublicKey();
  res.status(200).json({
    success: true,
    publicKey
  });
});

/**
 * @route   POST /api/notifications/subscribe
 * @desc    Save client push notification subscription
 * @access  Public
 */
router.post('/subscribe', async (req, res, next) => {
  try {
    const { endpoint, keys } = req.body;

    if (!endpoint || !keys || !keys.auth || !keys.p256dh) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription payload. Endpoint and keys (auth, p256dh) are required.'
      });
    }

    // Update existing subscription or insert new one
    const subscription = await PushSubscription.findOneAndUpdate(
      { endpoint },
      { keys },
      { new: true, upsert: true }
    );

    res.status(201).json({
      success: true,
      message: 'Subscription successfully registered',
      data: subscription
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/notifications/send-test
 * @desc    Trigger a mock push notification to all subscribers
 * @access  Public
 */
router.post('/send-test', async (req, res, next) => {
  try {
    const { title, body } = req.body;

    await notificationService.sendPushNotification(
      title || 'Test Notification',
      body || 'This is a test notification from Shree Chamunda Associates!'
    );

    // Send a real-time event to connected sockets too!
    notificationService.sendRealTimeMessage(req.io, 'inquiry_received', {
      message: 'This is a test real-time toast alert!'
    });

    res.status(200).json({
      success: true,
      message: 'Test notifications triggered successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
