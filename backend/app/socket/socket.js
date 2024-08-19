const Player = require('../player/player');

let games = [];
let gameTimer = [];

module.exports = (io) => {
  io.on('connection', (socket) => {

    // current time
    let time = new Date().toLocaleTimeString();

    // socket location
    const socketLocation = socket.handshake.address;

    console.log('Socket' + ` (${socket.id}) ` + ' from ' + socketLocation + ' connected at ' + time);

    socket.on('create-game', (gameSettings, callback) => {
      console.log('gamecreated #' + games.length + 1);
      createGame(gameSettings, socket, callback);
    });

    socket.on('join-game', (data, callback) => {
      joinGame(io, socket, data, callback);
    });

    socket.on('leave-game', () => {
      EmitEventOnDisconnect(io, socket);
    });

    socket.on('cancel-game', () => {
      cancelGame(io, socket.id);
    });

    // game events
    socket.on('start-game', () => {
      console.log('sv-side: start-game');
      startGame(io, socket.id);
    })

    socket.on('emit-question', (gameid, increment, callback) => {
      console.log('sv-side: emit-question');
      emitGameQuestion(gameid, increment, callback);
    });

    socket.on('player-answer', (socket, data) => {
      onPlayerAnswer(io, socket, data);
    });

    socket.on('disconnect', () => {
      console.log('Socket from ' + socketLocation + ' disconnected at ' + time);
      EmitEventOnDisconnect(io, socket);
    });
  });
};

function createGame(gameSettings, socket, callback) {

  try {
    const game = {
      gameSettings,
      gameid: socket.id,
      creator: socket.id,
      players: [],
      currentQuestionIndex: 0,
    };
    games.push(game);

    // Add the player to the game
    addPlayerToGame('creator', socket, game);

    // Emit the create-game event to the creator
    callback({ gameData: game });
  }
  catch (error) {
    console.error(error);
  }
}



function joinGame(io, socket, data, callback) {
  try {
    const { gameCode, username } = data;

    const gameData = findGameByCode(gameCode);

    // TODO: return an error if the game ID is not found
    if (!gameData?.gameid) {
      callback({ success: false });
      return;
    }
    // Add the player to the game
    addPlayerToGame(username, socket, gameData);

    // Emit the player-join event to creator 
    io.to(gameData.gameid.toString()).emit('player-join', {
      username,
      socket: socket.id
    });


    //send gameData object without players and questions
    const newGameData = JSON.parse(JSON.stringify(gameData));
    delete newGameData.players;
    delete newGameData.gameSettings.questions;

    callback({ gameData: newGameData });

  } catch (error) {
    console.error(error);
  }
}

function EmitEventOnDisconnect(io, socket) {
  try {

    if (!games.length)
      return;

    for (const game of games) {
      const playerIndex = game.players.findIndex(
        (player) => player.socket === socket.id
      );

      if (playerIndex === -1) {
        continue;
      }

      const player = game.players[playerIndex];

      // Emit the player-leave event to all players in the game
      io.to(game.gameid.toString()).emit('player-left', {
        username: player.username,
        socket: player.socket
      });

      game.players.splice(playerIndex, 1);

      // Cancel the game if there are no players left
      if (game.players.length === 0 || player.isCreator) {
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

function addPlayerToGame(username, socket, game) {

  try {
    const newPlayer = new Player(username, socket.id, game.gameid);
    game?.players.push(newPlayer);

    socket.join(game.gameid.toString());
  }
  catch (error) {
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

function findGameById(id) {
  try {
    const game = games?.find((game) => game.gameid === id);

    if (!game) {
      console.log("Game not found: " + id);
      return null;
    }

    return game;
  } catch (error) {
    console.error(error);
  }
}

function findPlayerBySocketId(game, socketId) {
  try {
    const player = game.players.find((player) => player.socket === socketId);

    if (!player) {
      return null;
    }

    return player;
  } catch (error) {
    console.error(error);
  }
}

// game events

function startGame(io, gameid) {
  try {
    const game = findGameById(gameid);

    if (!game)
      return;

    // create a timer for the game
    gameTimer[gameid] = setInterval(() => {

      // Emit the time-end event to all players in the game

      io.to(gameid).emit('time-end', []);
    }, game.gameSettings.timePerQuestion * 1000);

    io.to(game.gameid.toString()).emit('creator-start-game');
  } catch (error) {
    console.error(error);
  }
}
function getCurrentGameQuestion(gameid, qid) {

  const game = findGameById(gameid);

  if (!game)
    return;

  const localGameSettings = JSON.parse(JSON.stringify(game.gameSettings));
  const question = localGameSettings.questions[qid];

  return question;
}
function emitGameQuestion(gameid, increment = false, callback) {
  try {
    console.log('gameid: ' + gameid);

    const game = findGameById(gameid);

    if (!game)
      return;

    const incrementQuestion = increment ? game.currentQuestionIndex++ : game.currentQuestionIndex;

    console.log('currentQuestionIndex: ' + game.currentQuestionIndex);
    console.log('incrementQuestion: ' + incrementQuestion);

    const currentQuestion = getCurrentGameQuestion(gameid, incrementQuestion);

    callback({ server: currentQuestion });
  } catch (error) {
    console.error(error);
  }
}

function onPlayerAnswer(io, socket, data) {
  try {
    const { gameid, answer } = data;

    const game = findGameById(gameid);

    if (!game)
      return;

    const player = findPlayerBySocketId(game, socket.id);
    const currentQuestion = game?.gameSettings.questions[game.currentQuestionIndex];

    player?.answers.push({
      question: currentQuestion.question,
      answer
    });

    io.to(game.gameid.toString()).emit('player-answered', {
      username: player.username,
      socket: socket.id,
    });
  }
  catch (error) {
    console.error(error);
  }
}