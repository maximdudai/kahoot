const server = require('./app/server/server');
const socketHandler = require('./app/socket/socket');

// Initialize socket handler
socketHandler(server);

const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
