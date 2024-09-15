const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const socketHandler = require('./app/socket/socket');
require('dotenv').config();
const app = express();
const server = http.createServer(app);
const uploadRoutes = require('./app/routes/routes');


const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
socketHandler(io);

const PORT = process.env.PORT || 5050;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Use your routes
app.use('/upload', uploadRoutes);


