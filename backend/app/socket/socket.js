let games = [];

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('create-game', (gameSettings) => {
      console.log('game created');
      createGame(gameSettings, socket);
    });

    socket.on('join-game', (data) => {
      joinGame(io, socket, data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};

function createGame(gameSettings, socket) {

  const game = {
    gameSettings,
    gameid: socket.id,
    players: [],
  };
  games.push(game);

  socket.join(game.gameid.toString());
}

function joinGame(io, socket, data) {
  try {
    const { gameCode, player } = data;
    const { username } = player;

    const gameId = findGameByCode(gameCode);

    // TODO: return an error if the game ID is not found
    if (!gameId) {
      socket.emit('game-not-found');
      return;
    }

    socket.join(gameId.toString());
    io.to(gameId.toString()).emit('player-join', username);

  } catch (error) {
    console.error(error);
  }
}


function findGameByCode(code) {
  try {
    const game = games?.find((game) => game.gameSettings.gameCode === code);

    if (!game) {
      return null;
    }

    return game.gameid;
  } catch (error) {
    console.error(error);
  }
}