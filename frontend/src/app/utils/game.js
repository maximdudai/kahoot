export const generateGameId = () => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  return code;
}

export const handleJoinGame = (player, setTotalPlayers) => {
  setTotalPlayers((totalPlayers) => [...totalPlayers, player]);

  const localGameData = JSON.parse(localStorage.getItem("game"));
  localGameData.players.push(player);
  localStorage.setItem("game", JSON.stringify(localGameData));
};

export const handlePlayerLeft = (playerData, totalPlayers, setTotalPlayers) => {
  const newTotalPlayers = totalPlayers.filter(
    (player) => player.socket !== playerData.socket
  );

  setTotalPlayers(newTotalPlayers);

  const localGameData = JSON.parse(localStorage.getItem("game"));
  localGameData.players = newTotalPlayers;
  localStorage.setItem("game", JSON.stringify(localGameData));
};
