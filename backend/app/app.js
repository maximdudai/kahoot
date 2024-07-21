// app.js
const express = require('express');
const cors = require('cors');

const app = express();

// Set up CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
}));

// Import your routes
const uploadRoutes = require('./routes/routes');

// Use your routes
app.use('/upload', uploadRoutes);

module.exports = app;
