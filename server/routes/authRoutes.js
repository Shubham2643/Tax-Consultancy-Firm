const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const User = require('../models/User');
const Session = require('../models/Session');
const Otp = require('../models/Otp');
const { authenticate } = require('../middleware/auth');
const notificationService = require('../services/notificationService');

const SALT_LENGTH = 32;
const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';

function hashPassword(password) {
  const salt = crypto.randomBytes(SALT_LENGTH).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const verifyHash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString('hex');
  return hash === verifyHash;
}

// GET /api/auth/config
router.get('/config', (req, res) => {
  res.json({
    success: true,
    data: {
      googleClientId: process.env.GOOGLE_CLIENT_ID || 'your_google_client_id_here',
    },
  });
});

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, phone, otpCode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    if (!otpCode) {
      return res.status(400).json({ success: false, message: 'Verification OTP code is required' });
    }

    // Verify OTP record
    const otpRecord = await Otp.findOne({ target: email.toLowerCase(), otpCode });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP verification code' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    // Consume OTP code on successful validation
    await Otp.deleteOne({ _id: otpRecord._id });

    const hashedPassword = hashPassword(password);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || '',
      role: 'client',
    });

    const session = await Session.create({ userId: user._id });

    // Send registration confirmation alerts asynchronously to email & phone
    notificationService.sendRegistrationAlert(user.email, user.phone, user.name);

    res.status(201).json({
      success: true,
      data: {
        user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone },
        token: session.token,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!verifyPassword(password, user.password)) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const session = await Session.create({ userId: user._id });

    // Send login alert alerts asynchronously to email & phone
    notificationService.sendLoginAlert(user.email, user.phone, user.name);

    res.json({
      success: true,
      data: {
        user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone },
        token: session.token,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/logout
router.post('/logout', authenticate, async (req, res, next) => {
  try {
    await Session.deleteOne({ token: req.sessionToken });
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  res.json({
    success: true,
    data: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      phone: req.user.phone,
    },
  });
});

// POST /api/auth/google
router.post('/google', async (req, res, next) => {
  try {
    const { code, redirectUri } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Authorization code is required' });
    }

    let email, name;

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return res.status(500).json({ success: false, message: 'Google OAuth configuration parameters are missing on the server.' });
    }

    // Real Google API call
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const tokenParams = new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    });

    const tokenRes = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams.toString(),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      throw new Error(`Google token exchange failed: ${errText}`);
    }

    const tokenData = await tokenRes.json();
    const userInfoUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';
    const userInfoRes = await fetch(userInfoUrl, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userInfoRes.ok) {
      throw new Error('Failed to fetch user info from Google');
    }

    const userInfo = await userInfoRes.json();
    email = userInfo.email;
    name = userInfo.name;

    // Check/create user in DB
    let user = await User.findOne({ email: email.toLowerCase() });
    let isNewUser = false;
    if (!user) {
      isNewUser = true;
      const randomPassword = crypto.randomBytes(16).toString('hex');
      user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashPassword(randomPassword),
        role: 'client',
      });
    }

    const session = await Session.create({ userId: user._id });

    // Send confirmation alerts asynchronously to email & phone (if any)
    if (isNewUser) {
      notificationService.sendRegistrationAlert(user.email, user.phone || '', user.name);
    } else {
      notificationService.sendLoginAlert(user.email, user.phone || '', user.name);
    }

    res.json({
      success: true,
      data: {
        user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone || '' },
        token: session.token,
      },
    });
  } catch (err) {
    next(err);
  }
});


// POST /api/auth/otp/send — Generate and send OTP to Email or Phone
router.post('/otp/send', async (req, res, next) => {
  try {
    const { target } = req.body;
    if (!target) {
      return res.status(400).json({ success: false, message: 'Target email or phone is required' });
    }

    const cleanTarget = target.trim().toLowerCase();
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes TTL

    await Otp.findOneAndUpdate(
      { target: cleanTarget },
      { otpCode, expiresAt },
      { upsert: true, new: true }
    );

    await notificationService.sendOTP(cleanTarget, otpCode);

    res.json({ success: true, message: `OTP sent successfully to ${target}` });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/otp/verify — Verify an OTP code
router.post('/otp/verify', async (req, res, next) => {
  try {
    const { target, otpCode } = req.body;
    if (!target || !otpCode) {
      return res.status(400).json({ success: false, message: 'Target and OTP code are required' });
    }

    const cleanTarget = target.trim().toLowerCase();
    const otpRecord = await Otp.findOne({ target: cleanTarget, otpCode });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // Consume the OTP so it cannot be reused
    await Otp.deleteOne({ _id: otpRecord._id });

    res.json({ success: true, message: 'OTP verified successfully' });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/forgot-password/request — Verify account and dispatch verification OTP
router.post('/forgot-password/request', async (req, res, next) => {
  try {
    const { target } = req.body;
    if (!target) {
      return res.status(400).json({ success: false, message: 'Target email or phone is required' });
    }

    const cleanTarget = target.trim().toLowerCase();
    // Check user match via email or phone
    const user = await User.findOne({
      $or: [
        { email: cleanTarget },
        { phone: target.trim() }
      ]
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No registered account found matching this details' });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await Otp.findOneAndUpdate(
      { target: cleanTarget },
      { otpCode, expiresAt },
      { upsert: true, new: true }
    );

    await notificationService.sendOTP(cleanTarget, otpCode);

    res.json({
      success: true,
      message: `Verification code sent to your registered details`,
      data: { target: cleanTarget }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/forgot-password/reset — Verify OTP and update user password
router.post('/forgot-password/reset', async (req, res, next) => {
  try {
    const { target, otpCode, newPassword } = req.body;
    if (!target || !otpCode || !newPassword) {
      return res.status(400).json({ success: false, message: 'Target, OTP, and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const cleanTarget = target.trim().toLowerCase();
    const otpRecord = await Otp.findOne({ target: cleanTarget, otpCode });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
    }

    const user = await User.findOne({
      $or: [
        { email: cleanTarget },
        { phone: target.trim() }
      ]
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Consume verification token
    await Otp.deleteOne({ _id: otpRecord._id });
    user.password = hashPassword(newPassword);
    await user.save();

    res.json({ success: true, message: 'Password reset successfully. You can now login.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
