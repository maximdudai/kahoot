const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const socketIo = require('socket.io');
const socketHandler = require('./app/socket/socket');
const app = express();

const uploadRoutes = require('./app/routes/routes');

// Read the self-signed certificate and private key
const privateKey = fs.readFileSync('/etc/ssl/private/selfsigned.key', 'utf8');
const certificate = fs.readFileSync('/etc/ssl/certs/selfsigned.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Create HTTPS server
const server = https.createServer(credentials, app);

// WebSocket setup
const io = require('socket.io')(server, {
  cors: {
    origin: "https://kahoot-nine.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Access-Control-Allow-Headers", "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials"],
  }
});


app.use(cors({
  origin: "https://kahoot-nine.vercel.app/",
  methods: ['GET', 'POST'],
}));

// Your WebSocket event handlers
socketHandler(io);

// Set the port for HTTPS
const PORT = 3000; // Standard HTTPS port

// Start HTTPS server
server.listen(PORT, () => {
  console.log(`HTTPS Server is running on http://192.168.1.200:${PORT}`);
});

// Your other routes (e.g., /upload)
app.use('/upload', uploadRoutes);
app.get('/', function (req, res) {
  res.send('Hello World')
})
