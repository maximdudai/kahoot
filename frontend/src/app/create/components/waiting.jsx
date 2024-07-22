import { useState, useEffect, useRef } from "react";

import { io } from "socket.io-client";

export const WaitingPlayers = ({ updateStep }) => {
  const [players, setPlayers] = useState(0);
  const [totalPlayers, setTotalPlayers] = useState([]);
  const socket = useRef(null);

  useEffect(() => {
    // Use the server's IP address
    socket.current = io('http://192.168.1.180:5050'); // Replace with your server's IP address

    const handlePlayerJoin = ({ gameId, player }) => {
      console.log(`Player joined: ${player.username} in game: ${gameId}`);
      setTotalPlayers((prevPlayers) => [...prevPlayers, player]);
      setPlayers((prevPlayers) => prevPlayers + 1);
    };

    const handlePlayerLeft = (playerData) => {
      setTotalPlayers((prevPlayers) =>
        prevPlayers.filter((player) => player.id !== playerData.id)
      );
      setPlayers((prevPlayers) => prevPlayers - 1);
    };

    socket.current.on('player-join', handlePlayerJoin);
    socket.current.on('player-left', handlePlayerLeft);

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.current.off('player-join', handlePlayerJoin);
      socket.current.off('player-left', handlePlayerLeft);
      socket.current.disconnect();
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
          <div className="playersList w-1/3">
            <ul className="text-white w-full max-h-80 overflow-y-auto">
              {totalPlayers.map((player, index) => (
                <li className="border-b-2 border-gray-300/20 p-2 mr-1 bg-black/20" key={index}>{player.username}</li>
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
