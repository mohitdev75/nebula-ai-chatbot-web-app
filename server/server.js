require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nebula';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', chatRoutes);

// Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start Express server immediately
const server = app.listen(PORT, () => {
  console.log(`Nebula server running on http://localhost:${PORT}`);
});

// Attempt MongoDB Connection asynchronously with fail-fast timeout
mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 3000
  })
  .then(() => {
    console.log(`Connected to MongoDB at ${MONGODB_URI}`);
  })
  .catch((err) => {
    console.warn(`[Notice] MongoDB is not reachable (${err.message}). Using in-memory fallback until MongoDB is available.`);
  });
