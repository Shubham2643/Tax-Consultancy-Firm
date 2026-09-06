const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const Session = require('./models/Session');

// Route imports
const serviceRoutes = require('./routes/serviceRoutes');
const pricingRoutes = require('./routes/pricingRoutes');
const featureRoutes = require('./routes/featureRoutes');
const contactRoutes = require('./routes/contactRoutes');
const navMenuRoutes = require('./routes/navMenuRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const blogRoutes = require('./routes/blogRoutes');
const faqRoutes = require('./routes/faqRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const authRoutes = require('./routes/authRoutes');
const portalRoutes = require('./routes/portalRoutes');
const adminRoutes = require('./routes/adminRoutes');
const teamRoutes = require('./routes/teamRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const server = http.createServer(app);

// Allowed origins for CORS
const configuredOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const allowedOrigins = Array.from(new Set([
  ...configuredOrigins,
  'https://shreechamundaassociates.onrender.com',
  'http://localhost:5173',
  'http://localhost:3000'
]));

const isOriginAllowed = (origin) => {
  if (!origin) return true; // allow server-to-server / non-browser requests
  return allowedOrigins.includes(origin);
};

// Initialize Socket.io with room-based auth
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Security headers
app.use(helmet({
  contentSecurityPolicy: false, // disabled to avoid breaking inline styles in welcome page
  crossOriginEmbedderPolicy: false,
}));

// HTTPS enforcement in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

// Global rate limiter — 100 requests per minute per IP
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

// Strict rate limiter for auth endpoints — 10 requests per minute per IP
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many authentication attempts, please try again later.' },
});

// Strict rate limiter for contact form — 5 per minute
const contactLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many submissions, please try again later.' },
});

app.use(globalLimiter);

// CORS
app.use(cors({
  origin: function (origin, callback) {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Inject Socket.io into the request context
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket.io — Room-based connection with auth
io.on('connection', (socket) => {
  console.log(`🔌 Client connected to Socket: ${socket.id}`);

  // Client joins a user-specific room by sending their auth token
  socket.on('authenticate', async (token) => {
    try {
      if (!token) return;
      const session = await Session.findOne({ token, expiresAt: { $gt: new Date() } });
      if (session) {
        const userId = session.userId.toString();
        socket.join(`user:${userId}`);
        socket.userId = userId;

        // Also check if user is admin and join admin room
        const User = require('./models/User');
        const user = await User.findById(userId).select('role');
        if (user && user.role === 'admin') {
          socket.join('admin');
        }
        socket.emit('authenticated', { success: true });
      }
    } catch (err) {
      console.error('Socket auth error:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected from Socket: ${socket.id}`);
  });
});

// API Routes (with rate limiters on sensitive endpoints)
app.use('/api/services', serviceRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/features', featureRoutes);
app.use('/api/contact', contactLimiter, contactRoutes);
app.use('/api/navmenu', navMenuRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/portal', portalRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/portal/payments', paymentRoutes);



// Server root welcome page
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #071324; color: white; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; margin: 0; box-sizing: border-box;">
      <h1 style="color: #f8b400; font-size: 2.2rem; margin-bottom: 8px; font-weight: 800; letter-spacing: -0.5px;">Shree Chamunda Associates</h1>
      <p style="font-size: 1.1rem; color: #94a3b8; margin-bottom: 24px;">Secure MERN API Gateway Server</p>
      <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); padding: 12px 24px; border-radius: 6px; display: inline-flex; align-items: center; gap: 8px;">
        <span style="width: 8px; height: 8px; border-radius: 50%; background-color: #4CAF50; display: inline-block;"></span>
        <span style="color: #cbd5e1; font-size: 0.95rem; font-weight: 600;">System Online</span>
      </div>
    </div>
  `);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to DB and start HTTP/Socket server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
  });
});
