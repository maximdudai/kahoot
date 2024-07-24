import { useState, useEffect, useRef } from "react";

export const WaitingPlayers = ({ socket, updateStep }) => {
  const [players, setPlayers] = useState(0);
  const [totalPlayers, setTotalPlayers] = useState([]);

  useEffect(() => {

    const handleJoinGame = (player) => {
      setPlayers((players) => players + 1);
      setTotalPlayers((players) => [...players, player]);
    };

    const handlePlayerLeft = (playerData) => {
      setPlayers((players) => players - 1);
      setTotalPlayers((players) => players.filter((player) => player !== playerData));
    };

    socket.current.on("player-join", handleJoinGame);
    socket.current.on("player-left", handlePlayerLeft);

    return () => {
      socket.current.off("player-join", handleJoinGame);
      socket.current.off("player-left", handlePlayerLeft);
    };

  }, []);

  const handleCancelGame = () => {
    socket.current.emit("cancel-game");
    updateStep(0);
  };

  return (
    <>
      <div className="container p-2 flex flex-col items-center justify-center bg-white/20 rounded-md shadow-md">
        <div className="waitingTitle">
          {players === 0 ? (
            <h1 className="text-white text-2xl font-semibold">
              Waiting for players...
              <span>
                Total: {players} / 4
              </span>
            </h1>
          ) : (
            <h1 className="text-white text-2xl font-semibold">
              Players joined: {players}
            </h1>
          )}
        </div>
        {players >= 1 && (
          <div className="playersList w-full md:w-1/3">
            <ul className="text-white w-full max-h-80 overflow-y-auto">
              {totalPlayers.map((player, index) => (
                <li className="border-b-2 border-gray-300/20 p-2 mr-1 bg-black/20" key={index}>{player}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex flex-col my-3 gap-2 w-1/3 items-center">
          {players >= 1 && (
            <button
              className="w-full shadow-lg bg-green-500 text-white px-4 py-2 rounded-md"
              onClick={() => console.log("Start Game")}
            >
              Start Game
            </button>
          )}

          <button
            className="w-full shadow-lg bg-red-500 text-white px-4 py-2 rounded-md"
            onClick={handleCancelGame}
          >
            Cancel Game
          </button>
        </div>
      </div>
    </>
  );
};
