import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';
import chatRoutes from './routes/chat.js';
import lectureRoutes from './routes/lectures.js';
import lecturerRoutes from './routes/lecturers.js';
import hallRoutes from './routes/halls.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || '*',
  }),
);
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'usj-physics-assistant-backend' });
});

// Routes — these mirror the endpoints the frontend `services/` layer calls.
app.use('/api/chat', chatRoutes); // POST /api/chat
app.use('/api/lectures', lectureRoutes); // GET  /api/lectures
app.use('/api/lecturers', lecturerRoutes); // GET  /api/lecturers
app.use('/api/halls', hallRoutes); // GET  /api/halls

// Central error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Boot
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`USJ Physics Assistant API running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
