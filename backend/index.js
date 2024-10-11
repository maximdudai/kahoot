const express = require('express');
// const https = require('https');
const http = require('http');
const fs = require('fs');
const cors = require('cors');
const socketIo = require('socket.io');
const socketHandler = require('./app/socket/socket');
const app = express();
const multer = require('multer');
const uploadData = require('./app/routes/routes');
// Read the self-signed certificate and private key
// const privateKey = fs.readFileSync('/etc/ssl/private/selfsigned.key', 'utf8');
// const certificate = fs.readFileSync('/etc/ssl/certs/selfsigned.crt', 'utf8');
// const credentials = { key: privateKey, cert: certificate };

// Create HTTPS server
const server = http.createServer(app);

// WebSocket setup
const io = require('socket.io')(server, {
  cors: {
    origin: ["https:www.kahoot.pro", "https://kahoot.pro"],
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Access-Control-Allow-Headers", "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials"],
  }
});


// Your WebSocket event handlers
socketHandler(io);

// Set the port for HTTPS
const PORT = 80; // Standard HTTPS port

// Start HTTPS server
server.listen(PORT, () => {
  console.log(`HTTPS Server is running on http://51.178.18.74:${PORT}`);
});

// Your other routes (e.g., /upload)
const upload = multer({ storage: multer.memoryStorage() });

app.post('/upload', upload.single('file'), uploadData);
app.get('/', function (req, res) {
  res.send('Hello World')
})
