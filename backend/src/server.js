/**
 * Main Backend Server
 * Location: backend/src/server.js
 * 
 * Initializes Express, MongoDB connection, Socket.io, and routes
 */

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const medicineRoutes = require('./routes/medicine');
const healthRoutes = require('./routes/health');
const appointmentRoutes = require('./routes/appointments');
const notificationRoutes = require('./routes/notifications');

// Initialize Express app
const app = express();
const server = http.createServer(app);

const configuredOrigins = process.env.ALLOWED_ORIGINS?.split(',').map((o) => o.trim()) || ['http://localhost:3000'];
const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (configuredOrigins.includes(origin)) return true;

  // Allow local dev frontend ports like 3000, 3001, 3002, etc.
  return /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

// Socket.io setup
const io = socketIO(server, {
  cors: {
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: process.env.MAX_UPLOAD_SIZE || '10mb' }));
app.use(express.urlencoded({ limit: process.env.MAX_UPLOAD_SIZE || '10mb', extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare-chatbot')
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/medicine', medicineRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

// Socket.io handlers
io.on('connection', (socket) => {
  console.log(`👤 User connected: ${socket.id}`);

  // User joins their room
  socket.on('join', (userId) => {
    socket.join(`user:${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Real-time chat message
  socket.on('chat-message', async (data) => {
    try {
      const { userId, message, conversationId } = data;
      
      // Broadcast to user's room
      io.to(`user:${userId}`).emit('chat-update', {
        conversationId,
        role: 'user',
        content: message,
        timestamp: new Date(),
      });

      // Process message with AI (in actual implementation)
      // This would call the AI service and emit response
      
    } catch (error) {
      console.error('Chat error:', error);
      socket.emit('chat-error', { message: 'Error processing message' });
    }
  });

  // Medicine reminder acknowledgment
  socket.on('medicine-taken', async (data) => {
    const { userId, medicineId, time } = data;
    // Update adherence tracking
    io.to(`user:${userId}`).emit('medicine-logged', {
      medicineId,
      time,
      status: 'success',
    });
  });

  // Disconnect handler
  socket.on('disconnect', () => {
    console.log(`👤 User disconnected: ${socket.id}`);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Socket.io available at ws://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = { app, io, server };
