export const handleCancelGame = (router) => {
    alert("Game has been canceled, redirecting to the home page.");
    localStorage.clear();
    router.push("/");
};

export const onPlayerJoinGame = (player) => {
    let localGameData = JSON.parse(localStorage.getItem("game"));

    if (!localGameData || !localGameData.players) {
        console.error("No game data found or players array is missing.");
        return;
    }

    localGameData.players.push(player);
    localStorage.setItem("game", JSON.stringify(localGameData));

    const event = new Event("updateGamePlayers");
    window.dispatchEvent(event);
};

export const onPlayerLeaveGame = (playerData) => {
    let localGameData = JSON.parse(localStorage.getItem("game"));

    if (localGameData?.players === undefined) {
        return;
    }

    const updatedPlayers = localGameData.players.filter(
        (player) => player.socket !== playerData.socket
    );
    localGameData = { ...localGameData, players: updatedPlayers };
    localStorage.setItem("game", JSON.stringify(localGameData));

    const event = new Event("updateGamePlayers");
    window.dispatchEvent(event);
};