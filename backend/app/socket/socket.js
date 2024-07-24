const Player = require('../player/player');

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
      EmitEventOnDisconnect(io, socket);
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

    const gameData = findGameByCode(gameCode);

    // TODO: return an error if the game ID is not found
    if (!gameData.gameid) {
      socket.emit('game-not-found');
      return;
    }

    socket.join(gameData.gameid.toString());

    // Add the player to the game
    const newPlayer = new Player(username, socket.id, gameData.gameid);
    gameData.players.push(newPlayer);


    // Emit the player-join event to creator 
    io.to(gameData.gameid.toString()).emit('player-join', username);

  } catch (error) {
    console.error(error);
  }
}

function EmitEventOnDisconnect(io, socket) {
  try {
    
    if(!games.length)
        return;

    for (const game of games) {
      const playerIndex = game.players.findIndex(
        (player) => player.socket === socket.id
      );
  
      if (playerIndex === -1) {
        continue;
      }
  
      const player = game.players[playerIndex];
      game.players.splice(playerIndex, 1);
  
      // Emit the player-leave event to all players in the game
      io.to(game.gameid.toString()).emit('player-left', player.name);
  
      // Cancel the game if there are no players left
      if (game.players.length === 0) {
        cancelGame(io, game.gameid);
      }
    }

  } catch (error) {
    console.error(error);
  }
}

function cancelGame(io, gameid) {
  try {
    const gameIndex = games.findIndex((game) => game.gameid === gameid);

    if (gameIndex === -1) {
      return;
    }

    const game = games[gameIndex];

    // Emit the cancel-game event to all players in the game
    io.to(game.gameid.toString()).emit('cancel-game');

    // Remove the game from the list of games
    games.splice(gameIndex, 1);
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

    return game;
  } catch (error) {
    console.error(error);
  }
}