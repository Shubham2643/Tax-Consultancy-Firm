const Session = require('../models/Session');
const User = require('../models/User');

/**
 * Authentication middleware — validates session token from Authorization header.
 * Attaches req.user with full user object on success.
 */
const authenticate = async (req, res, next) => {
  try {
    let token = req.query.token;
    const authHeader = req.headers.authorization;
    
    if (!token && authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    const session = await Session.findOne({ token, expiresAt: { $gt: new Date() } });

    if (!session) {
      return res.status(401).json({ success: false, message: 'Invalid or expired session' });
    }

    const user = await User.findById(session.userId).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    req.sessionToken = token;
    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Authentication error' });
  }
};

/**
 * Role-based authorization middleware.
 * Must be used AFTER authenticate middleware.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
