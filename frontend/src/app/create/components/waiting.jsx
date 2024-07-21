import React, { useState, useEffect, useRef } from "react";

import { io } from "socket.io-client";

export const WaitingPlayers = ({ updateStep }) => {
  const [players, setPlayers] = useState(0);
  const [totalPlayers, setTotalPlayers] = useState([]);
  const socket = useRef(null);

  useEffect(() => {
    // Initialize the socket connection
    socket.current = io("http://localhost:5050");

    return () => {
      // Clean up the socket connection when the component unmounts
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    const handlePlayerJoin = (playerData) => {
      setTotalPlayers((prevPlayers) => [...prevPlayers, playerData]);
      
      setPlayers((prevPlayers) => prevPlayers + 1);
    };

    const handlePlayerLeft = (playerData) => {
      setTotalPlayers((prevPlayers) =>
        prevPlayers.filter((player) => player.id !== playerData.id)
      );
      
      setPlayers((prevPlayers) => prevPlayers - 1);
    };

    socket.current.on("player-join", handlePlayerJoin);
    socket.current.on("player-left", handlePlayerLeft);

    return () => {
      socket.current.off("player-join", handlePlayerJoin);
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
            </h1>
          ) : (
            <h1 className="text-white text-2xl font-semibold">
              Players joined: {players}
            </h1>
          )}
        </div>
        {
          players >= 1 && (
            <div className="playersList">
              <ul className="text-white">
                {totalPlayers.map((player, index) => (
                  <li key={index}>{player.name}</li>
                ))}
              </ul>
            </div>
          )
        }
        {players > 1 && (
          <button
            className="startGameButton bg-green-500 text-white px-4 py-2 rounded-md"
            onClick={() => console.log("Start Game")}
          >
            Start Game
          </button>
        )}

        <button
          className="cancelGameButton bg-red-500 text-white px-4 py-2 rounded-md"
          onClick={handleCancelGame}
        >
          Cancel Game
        </button>
      </div>
    </>
  );
};
