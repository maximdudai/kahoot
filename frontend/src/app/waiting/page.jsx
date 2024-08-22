"use client";

import { Playerlist } from "@/app/components/playerlist";
import { SocketContext } from "@/app/context/socket";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { Kahoot } from "@/app/components/title";
import { GameSettings } from "./components/settings";

// export const WaitingPlayers = ({ updateStep }) => {
export default function WaitingPlayers() {
  const [totalPlayers, setTotalPlayers] = useState([]);
  const [isCreator, setIsCreator] = useState(false);
  let router = useRouter();

  let socket = useContext(SocketContext);

  const handleJoinGame = (player) => {
    setTotalPlayers((totalPlayers) => [...totalPlayers, player]);

    // Update localStorage with the new player added
    const localGameData = JSON.parse(localStorage.getItem("game"));
    localGameData.players.push(player);
    localStorage.setItem("game", JSON.stringify(localGameData)); // Save back to localStorage
  };

  const handlePlayerLeft = (playerData) => {
    const newTotalPlayers = totalPlayers.filter(
      (player) => player.socket !== playerData.socket
    );

    setTotalPlayers(newTotalPlayers);

    // Update localStorage with the player removed
    const localGameData = JSON.parse(localStorage.getItem("game"));
    localGameData.players = newTotalPlayers;
    localStorage.setItem("game", JSON.stringify(localGameData));
  };

  useEffect(() => {
    socket?.on("player-join", handleJoinGame);
    socket?.on("player-left", handlePlayerLeft);

    socket?.on("creator-start-game", () => {
      router.push("/game", undefined, { shallow: true });
    });

    // Clean up the event listeners when the component unmounts or socket changes
    return () => {
      socket?.off("player-join", handleJoinGame);
      socket?.off("player-left", handlePlayerLeft);
      socket?.off("creator-start-game");
    };
  }, [socket]);

  useEffect(() => {
    const localGameData = JSON.parse(localStorage.getItem("game"));
    const availablePlayers = localGameData.players;

    const creator = localGameData.gameid;

    setIsCreator(creator === socket.id);
    setTotalPlayers(availablePlayers);
  }, []);

  //cancelgame
  // socket.emit("cancel-game");

  const handleStartGame = () => {
    socket?.emit("start-game");

    router.push("/game", undefined, { shallow: true });
  };

  return (
    <>
      <div className="container p-2 flex flex-col items-center justify-center rounded-md">
        <Kahoot />
        <div className="gameInformation w-full lg:w-1/2">
          <GameSettings />

          <div className="playerList w-full">
            <Playerlist players={totalPlayers} />
          </div>

          {isCreator && (
            <div className="startGame mt-4">
              <button
                className="w-full shadow-lg bg-green-500 text-white px-4 py-2 rounded-md"
                onClick={handleStartGame}
              >
                Start Game
              </button>
            </div>
          )}
        </div>

        {/* <div className="waitingTitle">
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
            <Playerlist players={totalPlayers} />
          </div>
        )}
        <div className="flex flex-col my-3 gap-2 w-1/3 items-center">
          {players >= 1 && (
            <button
              className="w-full shadow-lg bg-green-500 text-white px-4 py-2 rounded-md"
              onClick={handleStartGame}
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
        </div> */}
      </div>
    </>
  );
}
