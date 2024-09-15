const express = require('express');
const https = require('https');
const fs = require('fs');
const { Server } = require('socket.io');
const socketHandler = require('./app/socket/socket');
require('dotenv').config();
const app = express();
const uploadRoutes = require('./app/routes/routes');

// Load SSL certificates (replace with the correct paths)
const options = {
  key: fs.readFileSync('/path/to/privkey.pem'),
  cert: fs.readFileSync('/path/to/fullchain.pem')
};

// Create HTTPS server
const server = https.createServer(options, app);

// Create WebSocket server with HTTPS
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Set up WebSocket event handlers
socketHandler(io);

// Set the port
const PORT = process.env.PORT || 5050;

// Start the HTTPS server
server.listen(PORT, () => {
  console.log(`Server is running on https://localhost:${PORT}`);
});

// Use your routes
app.use('/upload', uploadRoutes);
