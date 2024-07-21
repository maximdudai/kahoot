// server.js
const http = require('http');
const app = require('../app'); // Import your Express app
const server = http.createServer(app);

module.exports = server;