export const getPlayerBySocket = (socketId) => {
  const localGameData = JSON.parse(localStorage.getItem("game"));
  const player = localGameData.players.find((player) => player.socket === socketId);
  return player;
}

export const updatePlayerAnswer = (socketId, playerList) => {
  if (!playerList || !socketId)
    return;

  playerList.forEach((_player) => {
    if (_player.socket === socketId) {
      _player.answer = true;
    }
  });

  return playerList;
};


export const updatePlayersAnswers = (playerList) => {
  if (!playerList)
    return;

  playerList.forEach((_player) => {
    _player.answer = false;
  });

  return playerList;
}

export const isGameCreator = (socket) => {
  const localGameData = JSON.parse(localStorage.getItem("game"));

  return localGameData?.gameid === socket;
}

export const getCorrectPercentage = (player) => {
  const correctAnswers = player.answers.filter((qData) => {
    // When someone join when the game is already started
    // the previous answers are undefined
    if(qData.answer !== undefined)
      return qData.answer === qData.correctAnswer;
  });
  const percentage = (correctAnswers.length / player.answers.length) * 100;

  return percentage.toFixed(2);
};

export const getCorrectAnswers = (player) => {
  const correctAnswers = player.answers.filter((qData) => {
    // When someone join when the game is already started
    // the previous answers are undefined
    if(qData.answer !== undefined)
      return qData.answer === qData.correctAnswer;
  });

  return `${correctAnswers.length}/${player.answers.length}`;
}