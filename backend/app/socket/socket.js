import Player from '../player/player.js';
import { v4 as uuidv4 } from 'uuid';

let games = [];
let gameTimer = [];
let gameInterval = [];

const QuestionAction = {
    INCREMENT: 'increment',
    DECREMENT: 'decrement',
    MAINTAIN: 'maintain'
};


export default (io) => {
    io.on('connection', (socket) => {

        // requested events
        socket.onAny((event, ...args) => {
            console.log(event, args);
        })

        socket.on('create-game', (gameSettings, callback) => {
            createGame(gameSettings, socket, callback);
        });

        socket.on('join-game', (data, callback) => {
            joinGame(io, socket, data, callback);
        });

        socket.on('leave-game', () => {
            EmitEventOnDisconnect(io, socket);
        });

        socket.on('server-cancel-game', () => {
            cancelGame(io, socket.id);
        });

        // game events
        socket.on('start-game', () => {
            startGame(io, socket.id);
        })

        socket.on('emit-question', (gameid, increment, callback) => {
            emitGameQuestion(io, gameid, increment, callback);
        });

        socket.on('get-results', (gameid, callback) => {
            emitEndGame(gameid, callback);
        });

        socket.on('player-answer', (data) => {
            onPlayerAnswer(io, socket, data);
        });

        socket.on('question-hint', (data) => {
            handleQuestionHint(io, data);
        });

        socket.on('increase-timer', (data) => {
            increaseGameTimer(io, data);
        });

        socket.on('disconnect', () => {
            EmitEventOnDisconnect(io, socket);
        });
    });
};
function createGame(gameSettings, socket, callback) {
    const generatedGameId = uuidv4();

    try {
        const playerData = {
            username: gameSettings.creator,
            token: generatedGameId,
            socket: socket.id,
            isCreator: true
        };

        // Create the game object with modified gameSettings
        const game = {
            gameSettings: {
                ...gameSettings,
                creator: playerData
            },
            gameid: generatedGameId,
            players: [],
            currentQuestionIndex: 0,
            playersInQueue: [],
        };

        // Add to games array
        games.push(game);

        // Initialize timer and interval
        gameTimer[game.gameid] = null;
        gameInterval[game.gameid] = null;

        // Add the creator to the game
        addPlayerToGame(playerData.username, socket, generatedGameId, game);

        // Send response back
        callback({
            success: true,
            isCreator: true,
            gameData: {
                gameSettings: game.gameSettings,
                gameid: game.gameid,
                players: game.players
            },
            token: generatedGameId
        });
    }
    catch (error) {
        console.error(error);
    }
}
function joinGame(io, socket, data, callback) {
    try {
        const { gameCode, username, token } = data;
        const gameData = findGameByCode(gameCode);
        const playerUuid = token ?? uuidv4();

        const isPlayerInGame = findPlayerByUuid(gameData, token);

        if (isPlayerInGame) {
            callback({
                success: false,
                error: "Player already in game!"
            });
            return;
        }

        // Return an error if the game ID is not found
        if (!(gameData && gameData.gameid)) {
            callback({
                success: false,
                error: "Game not found!"
            });
            return;
        }

        // Add the player to the game
        addPlayerToGame(username, socket, playerUuid, gameData);

        io.to(gameData.gameid.toString()).emit('player-join', {
            username,
            socket: socket.id,
            token: playerUuid,
            score: 0
        });

        //in case of the request is maded by the creater (comparing the token) then return the full game data
        let newGameData = [];
        let isCreator = false;
        if (token !== gameData.gameid) {
            newGameData = JSON.parse(JSON.stringify(gameData));
            delete newGameData.gameSettings.questions;
            delete newGameData.creator;
        } else {
            newGameData = gameData;
            isCreator = true;
        }

        callback({
            success: true,
            isCreator,
            gameData: newGameData,
            inQueue: (!isCreator && gameTimer[gameData.gameid] !== null),
            token: playerUuid
        });
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
        io.to(game.gameid.toString()).emit('client-cancel-game');

        // Remove the game from the list of games
        games.splice(gameIndex, 1);
    } catch (error) {
        console.error(error);
    }
}

function addPlayerToGame(username, socket, token, game) {
    try {
        const newPlayer = new Player(username, socket.id, token, game.gameid);
        game.players.push(newPlayer);

        const isNewPlayerTheCreator = isPlayerCreator(game, token);

        // Add the player (if it's not creator) to the queue if the game has already started
        if (!isNewPlayerTheCreator && gameTimer[game.gameid] !== null) {
            newPlayer.inQueue = true;
            game.playersInQueue.push(newPlayer);
        }

        socket.join(game.gameid.toString());
    }
    catch (error) {
        console.error(error);
    }
}

function findGameByCode(code) {
    try {
        const game = games ? games?.find((game) => game.gameSettings.gameCode === code) : null;
        return game ?? null;
    } catch (error) {
        console.error(error);
    }
}


function findGameById(id) {
    try {
        const game = games ? games?.find((game) => game.gameid === id) : null;

        return game ?? null;
    } catch (error) {
        console.error(error);
    }
}

function findPlayerBySocketId(game, socketId) {
    try {
        const player = game?.players?.find((player) => player.socket === socketId);
        return player ?? null;
    } catch (error) {
        console.error(error);
    }
}

function findPlayerByUuid(game, uuid) {
    try {
        const player = game?.players?.find((player) => player.token === uuid);
        return player ?? null;
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

        io.to(game.gameid.toString()).emit('creator-start-game');
        startGameTimer(io, game.gameid);

    } catch (error) {
        console.error(error);
    }
}

function startGameTimer(io, gameId) {
    const game = findGameById(gameId);

    if (!game)
        return;

    if (gameInterval[gameId]) {
        clearInterval(gameInterval[gameId]);
        gameTimer[gameId] = null;
    }

    gameTimer[gameId] = game.gameSettings.time;

    // Save the interval in the game object so we can clear it later if needed
    gameInterval[gameId] = setInterval(() => {

        gameTimer[gameId]--;

        sendTimerToServer(io, gameId, gameTimer[gameId]);

        if (gameTimer[gameId] <= 0) {
            clearInterval(gameInterval[gameId]);
            io.to(gameId).emit('timer-update', {
                timeRemaining: null
            });
        }
    }, 1000);
}

function increaseGameTimer(io, data) {
    const { gameid } = data;

    gameTimer[gameid] += 10;

    sendTimerToServer(io, gameid, gameTimer[gameid]);

}

function sendTimerToServer(io, gameid, timer) {
    io.to(gameid).emit('timer-update', {
        timeRemaining: timer
    });
};

function getCurrentGameQuestion(gameid, qid) {

    const game = findGameById(gameid);

    if (!game)
        return;

    const localGameSettings = JSON.parse(JSON.stringify(game.gameSettings));
    const question = localGameSettings.questions[qid];

    return question;
}
function emitGameQuestion(io, gameid, increment = QuestionAction.MAINTAIN, callback) {
    try {
        const game = findGameById(gameid);

        if (!game)
            return;

        if (game.currentQuestionIndex >= game.gameSettings.questions.length - 1) {
            io.to(game.gameid.toString()).emit('end-game');
            return;
        }

        // prevent incrementing the question index if the game is over
        switch (increment) {
            case QuestionAction.INCREMENT:
                if (game.currentQuestionIndex < game.gameSettings.questions.length - 1) {
                    game.currentQuestionIndex++;
                }
                break;
            case QuestionAction.DECREMENT:
                if (game.currentQuestionIndex > 0) {
                    game.currentQuestionIndex--;
                }
                break;
            case QuestionAction.MAINTAIN:
            default:
                break;
        }

        const currentQuestion = getCurrentGameQuestion(gameid, game.currentQuestionIndex);

        // check if there is somene in game queue
        checkGameQueue(io, gameid);

        // Emit the question to all clients in the game room
        io.to(gameid).emit('new-question', { server: currentQuestion });

        // reset game timer
        startGameTimer(io, gameid);

        // clear game hints
        game.hintIndex = [];

        // Callback to the creator if needed
        if (callback)
            callback({ server: currentQuestion });

    } catch (error) {
        console.error(error);
    }
}

function emitEndGame(gameid, callback) {
    const game = findGameById(gameid);

    if (!game)
        return;

    callback({ playerList: game.players });
    return;
}

function checkGameQueue(io, gameId) {
    const game = findGameById(gameId);

    if (!game)
        return;

    if (!game.playersInQueue.length)
        return;

    // Add queued players to the game
    io.to(game.gameid.toString()).emit('player-join-queue');

    // Clear the queue
    game.playersInQueue = [];
}


function onPlayerAnswer(io, socket, data) {
    try {
        const { gameid, response } = data;
        const game = findGameById(gameid);

        if (!game)
            return;

        if (gameTimer[gameid] === null)
            return;

        const player = findPlayerBySocketId(game, socket.id);
        const currentQuestion = game?.gameSettings.questions[game.currentQuestionIndex];

        //update player answer on current question
        player.answers[game.currentQuestionIndex] = {
            answer: response,
            correctAnswer: currentQuestion.correct_option_index
        };

        io.to(game.gameid.toString()).emit('player-answered', { socketId: socket.id });
    }
    catch (error) {
        console.error(error);
    }
}

function handleQuestionHint(io, data) {

    try {
        const { gameid } = data;
        const game = findGameById(gameid);

        if (!game)
            return;

        game.hintIndex = game.hintIndex || [];

        if (game.hintIndex.length >= 3)
            return;

        const randomIndex = Math.floor(Math.random() * 4);

        // check if the hint has already been used
        const alreadyHinted = game.hintIndex?.filter((index) => index === randomIndex);

        while (alreadyHinted.length > 0)
            randomIndex = Math.floor(Math.random() * 4);

        // add the hint index to the game object
        game.hintIndex.push(randomIndex);

        io.to(game.gameid.toString()).emit("client-question-hint", {
            hints: game.hintIndex
        });
    }
    catch (error) {
        console.error(error);
    }
}

function isPlayerCreator(gameid, token) {
    const game = findGameById(gameid);

    if (!game)
        return false;

    return game.gameSettings.creator.token === token;
}