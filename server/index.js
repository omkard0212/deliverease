const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const locationRoutes = require('./routes/location');
const userRoutes = require('./routes/users');
const AgentLocation = require('./models/AgentLocation');

const app = express();
const server = http.createServer(app);

// Socket.IO setup — allow cross-origin from the React dev server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Make io accessible inside route handlers via req.io
app.set('io', io);

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// ── REST Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/', (req, res) => res.json({ message: 'DeliverEase API is running' }));

// ── Socket.IO Events ──────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Customer joins a room named after their trackingId to receive live updates
  socket.on('join_tracking', (trackingId) => {
    socket.join(trackingId);
    console.log(`Socket ${socket.id} joined room: ${trackingId}`);
  });

  // Agent emits their location every ~5 seconds
  // Server saves to DB and broadcasts to the correct tracking room
  socket.on('agent_location_update', async ({ agentId, lat, lng, trackingId }) => {
    try {
      // Upsert agent location in the database
      await AgentLocation.findOneAndUpdate(
        { agentId },
        { lat, lng, isOnline: true, lastUpdated: new Date() },
        { upsert: true, new: true }
      );

      // Broadcast the new location to everyone tracking this order
      if (trackingId) {
        io.to(trackingId).emit('agent_location_update', { lat, lng });
      }
    } catch (err) {
      console.error('Error saving agent location via socket:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// ── Database + Server Start ───────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
