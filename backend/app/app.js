// app.js

const express = require('express');
const app = express();
const cors = require('cors');

// Set up CORS
app.use(cors({
  origin: `${process.env.SERVER_IP}:${process.env.SERVER_PORT}`,
  methods: ['GET', 'POST'],
}));

// Import your routes
const uploadRoutes = require('./routes/routes');

// Use your routes
app.use('/upload', uploadRoutes);

module.exports = app;
