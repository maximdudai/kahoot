const { Server } = require('socket.io');

const { generateUniqueId } = require('../utils/generateId');

// Object to store game data, where each key is a game ID
let games = {};

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('create-game', (gameSettings) => {
      createGame(io, gameSettings);
    });

    socket.on('join-game', (data) => {
      joinGame(io, data);
    });

    socket.on('cancel-game', (gameId) => {
      cancelGame(io, gameId);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};

function createGame(io, gameSettings) {
  const gameId = generateUniqueId();
  games[gameId] = {
    players: [],
    gameSettings: gameSettings,
    gameCode: gameSettings.gameCode
  };

  io.emit('create-game', { gameId, gameSettings });
  console.log(`Game created with ID: ${gameId}`);
}

function joinGame(io, data) {
  const { gameId, player } = data;

  console.log(games[gameId]);

  if (games[gameId]) {


    games[gameId].players.push(player);
    io.emit('player-join', { gameId, player });
    console.log(`Player joined game with ID: ${gameId}`);
  } else {
    console.error(`Game with ID: ${gameId} does not exist`);
  }
}

function cancelGame(io, gameId) {
  if (games[gameId]) {
    delete games[gameId];
    io.emit('cancel-game', gameId);
    console.log(`Game with ID: ${gameId} cancelled`);
  } else {
    console.error(`Game with ID: ${gameId} does not exist`);
  }
}
