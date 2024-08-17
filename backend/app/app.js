// app.js
const express = require('express');

const app = express();


// Set up CORS
app.use(cors({
  origin: 'http://192.168.1.200:3000',
  methods: ['GET', 'POST'],
}));

// Import your routes
const uploadRoutes = require('./routes/routes');

// Use your routes
app.use('/upload', uploadRoutes);

module.exports = app;
