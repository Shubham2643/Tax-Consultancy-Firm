const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

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
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (server-to-server, mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Inject Socket.io into the request context
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket connection logger
io.on('connection', (socket) => {
  console.log(`🔌 Client connected to Socket: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected from Socket: ${socket.id}`);
  });
});

// API Routes
app.use('/api/services', serviceRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/features', featureRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/navmenu', navMenuRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/portal', portalRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/portal/payments', paymentRoutes);



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
