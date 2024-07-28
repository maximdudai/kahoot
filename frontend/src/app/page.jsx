"use client";

import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { JoinGame } from "./components/join/connect";
import { WaitingGameStart } from "./components/join/waiting";

export default function Home() {
  const [username, setUsername] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [joinStep, setJoinStep] = useState(0);

  const socket = useRef(null);

  useEffect(() => {
    // Initialize the socket connection
    socket.current = io("http://192.168.1.180:5050"); // Replace with your server's actual IP address

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const handleJoinGame = () => {
    if (username === "" || gameCode === "") {
      alert("Please fill in all fields.");
      return;
    }

    socket.current.emit('join-game', { gameCode, username }, (response) => {
      
      if(response?.success == false) {
        alert("Game not found");
        return;
      }

      setJoinStep(response?.success);
    });
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
