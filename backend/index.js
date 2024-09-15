const express = require('express');
const http = require('http');
const cors = require('cors');
const fs = require('fs');
const socketIo = require('socket.io');
const socketHandler = require('./app/socket/socket');
require('dotenv').config();
const app = express();
const uploadRoutes = require('./app/routes/routes');


// Create HTTPS server
const server = http.createServer(app);

// Create WebSocket server with HTTPS
const io = socketIo(server, {
  cors: {
      origin: 'https://kahoot-nine.vercel.app', // Replace with your frontend domain
      methods: ['GET', 'POST'],
      credentials: true
  }
});

app.use(cors({
  origin: 'https://kahoot-nine.vercel.app',
  methods: ['GET', 'POST'],
}));

// Set up WebSocket event handlers
socketHandler(io);

// Set the port
const PORT = process.env.PORT || 3000;

// Start the HTTPS server
server.listen(PORT, () => {
  console.log(`Server is running on https://localhost:${PORT}`);
});

// Use your routes
app.use('/upload', uploadRoutes);
