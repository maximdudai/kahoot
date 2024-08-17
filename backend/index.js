const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const socketHandler = require('./app/socket/socket');
const cors = require('cors');

require('dotenv').config();

// Import your routes
const uploadRoutes = require('./app/routes/routes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors({
  origin: 'http://192.168.1.200:3000',
  methods: ['GET', 'POST'],
}));

// Initialize socket handler
socketHandler(io);

const PORT = process.env.PORT || 5050;
const HOST = '0.0.0.0'; // Listen on all network interfaces

server.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});

// Use your routes
app.use('/upload', uploadRoutes);
