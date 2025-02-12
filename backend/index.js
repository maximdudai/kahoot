import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import multer, { memoryStorage } from 'multer';
import { config } from 'dotenv';

import uploadData from './app/routes/routes.js';
import socketHandler from './app/socket/socket.js';

config();

const app = express();
const server = createServer(app);

app.use(cors({
  origin: ["https://kahoot.pro", "https://www.kahoot.pro"],
  methods: ["GET", "POST"],
  credentials: true
}));

// Create a Socket.io server instance with proper configuration
const io = new Server(server, {
  cors: {
    origin: ["https://kahoot.pro", "https://www.kahoot.pro"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Initialize socket handling
socketHandler(io);

// Set the port for the HTTP server
const PORT = 4000;

server.listen(PORT, () => {
  console.log(`HTTP Server is running on http://51.178.18.74:${PORT}`);
});

const upload = multer({ storage: memoryStorage() });
app.post('/api/upload', upload.single('file'), uploadData);
