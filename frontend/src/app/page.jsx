"use client";

import React, { useState, useContext } from "react";
import { io } from "socket.io-client";
import { JoinGame } from "./components/join/connect";
import { WaitingGameStart } from "./components/join/waiting";
import { SocketContext } from "./context/socket";

export default function Home() {
  const [username, setUsername] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [joinStep, setJoinStep] = useState(0);

  const socket = useContext(SocketContext);

  const handleJoinGame = () => {
    if (username === "" || gameCode === "") {
      alert("Please fill in all fields.");
      return;
    }

    if (socket) {
      socket.emit("join-game", { gameCode, username }, (response) => {
        if (response?.success == false) {
          alert("Game not found");
          return;
        }

        setJoinStep(response?.success);
      });
    }
  };

  return joinStep === 0 ? (
    <JoinGame
      setUsername={setUsername}
      setGameCode={setGameCode}
      handleJoinGame={handleJoinGame}
    />
  ) : (
    <WaitingGameStart />
  );
}
