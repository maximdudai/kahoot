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

    const gameData = JSON.parse(localStorage.getItem("game"));
    
    if (gameData) {
      // Compare creator socket with client socket.id
      const isCreatorSocketEqual = gameData.creator === socket.id;
      setIsCreator(isCreatorSocketEqual);

    } else {
      console.error("No game data found in localStorage.");
    }
  }, [])

  useEffect(() => {
  
    const gameData = JSON.parse(localStorage.getItem("game"));
    const gameId = gameData?.gameid;
  
    // Emit event to the server to get the question
    socket?.emit("emit-question", gameId, (data) => {
      setGameQuestion(data?.server.question);
      setGameOptions(data?.server.options);      
    });
  
    return () => {
      socket.off("emit-question");
    };
  }, []);
  

  if (isCreator === null) {
    return <div>Loading...</div>;
  }

  return isCreator ? (
    <CreatorScreen question={gameQuestion} options={gameOptions} />
  ) : (
    <PlayerScreen question={gameQuestion} options={gameOptions} />
  );
}
