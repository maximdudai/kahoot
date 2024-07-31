"use client";

import { useContext, useEffect, useState } from "react";
import { SocketContext } from "@/app/context/socket";
import { CreatorScreen } from "./components/creator";
import { PlayerScreen } from "./components/player";

export default function Game() {
  const [isCreator, setIsCreator] = useState(null);

  let [gameQuestion, setGameQuestion] = useState(null);
  let [gameOptions, setGameOptions] = useState([]);

  const socket = useContext(SocketContext);

  useEffect(() => {
    const handleConnect = () => {
      const gameDataString = localStorage.getItem("game");
      
      if (gameDataString) {
        const gameData = JSON.parse(gameDataString); // Parse the JSON string into an object
        
        console.log(socket.id, gameData.creator);

        setIsCreator(socket.id === gameData.creator);
      }
    };

    // Check if the socket is already connected
    if (socket && socket.connected) {
      handleConnect();
    } else if (socket) {
      // Listen for the 'connect' event
      socket.on('connect', handleConnect);
    }

    return () => {
      if (socket) {
        socket.off('connect', handleConnect);
      }
    };
  }, [socket]);
  
  useEffect(() => {
    const gameNextQuestion = (data) => {
      console.log(data);
      
      const { question, options } = data;
      
      setGameQuestion(question);
      setGameOptions(options);
    };

    if (socket) {
      socket.on("next-question", gameNextQuestion);
    }

    return () => {
      if (socket) {
        socket.off("next-question", gameNextQuestion);
      }
    };
  }, [socket]);

  if (isCreator === null) {
    return <div>Loading...</div>;
  }

  return isCreator ? (
    <CreatorScreen question={gameQuestion} options={gameOptions} />
  ) : (
    <PlayerScreen question={gameQuestion} options={gameOptions} />
  );
}
