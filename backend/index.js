const express = require('express');
const http = require('http');
const cors = require('cors');
const socketHandler = require('./app/socket/socket');
const app = express();
const multer = require('multer');
const uploadData = require('./app/routes/routes');

const dotenv = require('dotenv');
dotenv.config();


const server = http.createServer(app);

app.use(cors({
  origin: 'http://' + process.env.FRONTEND_ADDRESS + process.env.BACKEND_ADDRESS,
  methods: ['GET', 'POST'],
  credentials: true
}));


const io = require('socket.io')(server, {
  cors: {
    origin: ["http://" + process.env.FRONTEND_ADDRESS + process.env.BACKEND_ADDRESS],
    methods: ["GET", "POST"],
    credentials: true
  }
});


socketHandler(io);

// Set the port for HTTPS
const PORT = 3000; // Standard HTTPS port

// Start HTTPS server
server.listen(PORT, () => {
  console.log(`HTTPS Server is running on http://51.178.18.74:${PORT}`);
});

const upload = multer({ storage: multer.memoryStorage() });
app.post('/upload', upload.single('file'), uploadData);
