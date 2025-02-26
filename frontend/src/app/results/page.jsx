"use client";

import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/socket";
import {
  getCorrectAnswers,
  getCorrectPercentage,
} from "../utils/player";
import { Kahoot } from "../components/title";
import { ProgressBar } from "../components/progressbar";

export default function Results() {
  const [playerList, setPlayerList] = useState([]);
  const [gameData, setGameData] = useState(() => {
    const savedGame = localStorage.getItem("game");
    return savedGame ? JSON.parse(savedGame) : null;
  });
  const {socket, isCreator} = useContext(SocketContext);

  useEffect(() => {
    if (gameData) {
      localStorage.setItem("game", JSON.stringify(gameData));
    }
  }, [gameData]);

  useEffect(() => {
    if (socket && gameData) {
      socket.emit("get-results", gameData.gameid, (response) => {
        const playerListWithPercentage = () =>
			response.playerList.map((player) => {
			return {
				...player,
				correctAnswers: getCorrectAnswers(player),
				correctAnswersByPercentage: getCorrectPercentage(player),
			};
		});

		const sortedPlayerList = playerListWithPercentage().sort((a, b) => 
			b.correctAnswersByPercentage - a.correctAnswersByPercentage);

        setPlayerList(sortedPlayerList);
      });

      return () => {
        socket.off("get-results");
      };
    }
  }, [socket, gameData]);

  const handleEndGame = () => {
    socket?.emit("server-cancel-game");
  };

  return (
    <>
      <div className="flex flex-col gap-2 text-white">
        <Kahoot />
        <div
          className="h-96"
          style={{
            overflowY: "auto",
            scrollbarColor: "rgba(255, 255, 255, 0.5) rgba(0, 0, 0, 0.5)",
          }}
        >
          {playerList?.map((player, index) => (
            <ul
              key={index}
              className="flex flex-col justify-center my-2 mr-2 bg-green-600/80 p-2 rounded-md"
            >
              <div className="flex justify-between text-lg">
                <li>{player.username}</li>
                <li>{player.correctAnswers}</li>
              </div>
              <div className="progressBar mt-2">
                <ProgressBar percentage={player.correctAnswersByPercentage} />
              </div>
            </ul>
          ))}
          {isCreator && (
            <button
              onClick={handleEndGame}
              className="bg-green-500 text-white p-2 rounded-md"
            >
              End Game
            </button>
          )}
        </div>
      </div>
    </>
  );
}
