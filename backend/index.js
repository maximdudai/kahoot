const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const socketIo = require('socket.io');
const socketHandler = require('./app/socket/socket');

const app = express();

// Read the self-signed certificate and private key
const privateKey = fs.readFileSync('/etc/ssl/private/selfsigned.key', 'utf8');
const certificate = fs.readFileSync('/etc/ssl/certs/selfsigned.crt', 'utf8');

const credentials = { key: privateKey, cert: certificate };

// Create HTTPS server
const server = https.createServer(credentials, app);

// WebSocket setup
const io = socketIo(server, {
  cors: {
    origin: ['https://kahoot-nine.vercel.app'], // Allow your frontend
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(cors({
  origin: ['https://kahoot-nine.vercel.app'],
  methods: ['GET', 'POST'],
}));

// Your WebSocket event handlers
socketHandler(io);

// Set the port for HTTPS
const PORT = 443; // Standard HTTPS port

// Start HTTPS server
server.listen(PORT, () => {
  console.log(`HTTPS Server is running on https://51.178.18.74:${PORT}`);
});

// Your other routes (e.g., /upload)
app.use('/upload', uploadRoutes);
