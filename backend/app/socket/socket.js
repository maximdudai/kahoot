let games = {};
let totalGames = 0;

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('create-game', (gameSettings) => {
      console.log('Received create-game event');
      createGame(io, gameSettings, socket);
    });

    socket.on('join-game', (data) => {
      console.log('Received join-game event');
      joinGame(io, data, socket);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};

function createGame(io, gameSettings, socket) {
  totalGames++;
  const gameId = totalGames;

  games[gameId] = {
    gameSettings: gameSettings,
    players: [],
  };

  console.log(`Creating game with ID: ${gameId} and Code: ${gameSettings.gameCode}`);
  socket.join(gameId.toString());

  // Emit event to the room after joining
  io.to(gameId.toString()).emit('create-game', { gameId, gameSettings });
  console.log(`Game created with ID: ${gameId} and Code: ${gameSettings.gameCode}`);
}

function joinGame(io, data, socket) {
  const { gameCode, player } = data;
  const gameId = findGameByCode(gameCode);

  console.log(`Player ${player.username} trying to join game with code: ${gameCode}`);

  if (gameId !== null) {
    games[gameId].players.push(player);
    socket.join(gameId.toString());
    io.to(gameId.toString()).emit('player-join', { gameId, player });
    console.log(`Player joined game with ID: ${gameId}`);
  } else {
    socket.emit('error', `Game with code: ${gameCode} not found`);
    console.error(`Game with code: ${gameCode} not found`);
  }
}

function findGameByCode(code) {
  for (let gameId in games) {
    if (games[gameId].gameSettings.gameCode === code) {
      return gameId;
    }
  }
  return null;
}