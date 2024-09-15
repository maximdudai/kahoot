"use client";

import { createContext, useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";
import { isGameCreator } from "../utils/player";
import { useBeforeUnload } from "react-router-dom";
import { IoMdReturnLeft } from "react-icons/io";

export const SocketContext = createContext(null);

export default function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const newSocket = io(process.env.SOCKET_URL);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleCancelGame = () => {
      alert("Game has been canceled, redirecting to the home page.");

      // Clear the local storage
      localStorage.removeItem("game");
      localStorage.removeItem("username");
      localStorage.removeItem("socket");

      // Redirect to the home page
      router.push("/");
    };

    const handleJoinGame = (player) => {
      let localGameData = JSON.parse(localStorage.getItem("game"));

      if (!localGameData || !localGameData.players) {
        console.error("No game data found or players array is missing.");
        return;
      }

      // Make a copy of the players array before modifying it
      const updatedPlayers = [...localGameData.players, player];
      localGameData = { ...localGameData, players: updatedPlayers };

      // Update localStorage with the new player added
      localStorage.setItem("game", JSON.stringify(localGameData));

      // Dispatch event to notify about the update
      const event = new Event("updateGamePlayers");
      window.dispatchEvent(event);
    };

    const handlePlayerLeft = (playerData) => {
      let localGameData = JSON.parse(localStorage.getItem("game"));

      if (!localGameData || !localGameData.players) {
        console.error("No game data found or players array is missing.");
        return;
      }

      // Filter out the player who left
      const updatedPlayers = localGameData.players.filter(
        (player) => player.socket !== playerData.socket
      );
      localGameData = { ...localGameData, players: updatedPlayers };

      // Update localStorage with the player removed
      localStorage.setItem("game", JSON.stringify(localGameData));

      // Dispatch event to notify about the update
      const event = new Event("updateGamePlayers");
      window.dispatchEvent(event);
    };

    socket?.on("client-cancel-game", handleCancelGame);
    socket?.on("player-join", handleJoinGame);
    socket?.on("player-left", handlePlayerLeft);

    return () => {
      socket?.off("client-cancel-game", handleCancelGame);
      socket?.off("player-join", handleJoinGame);
      socket?.off("player-left", handlePlayerLeft);
    };
  }, [socket]);

  useBeforeUnload(
    useCallback(() => {
      const isCreator = isGameCreator(socket?.id);
      if (!isCreator) return;
      
      // socket?.emit("server-cancel-game");
    }, [socket])
  );

  if (!socket) {
    return null; // Or a loading spinner or placeholder
  }

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
