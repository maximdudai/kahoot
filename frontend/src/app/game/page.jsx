"use client";

import { useContext, useEffect, useState } from "react";
import { SocketContext } from "@/app/context/socket";
import { CreatorScreen } from "./components/creator";
import { PlayerScreen } from "./components/player";

export default function Game() {
  const [isCreator, setIsCreator] = useState(null);

  const [gameQuestion, setGameQuestion] = useState(null);
  const [gameOptions, setGameOptions] = useState([]);

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
  }, []);

  // Function to fetch the next question, used by the creator
  const fetchNextQuestion = (increment = false) => {
    const gameData = JSON.parse(localStorage.getItem("game"));
    const gameId = gameData?.gameid;

    socket?.emit("emit-question", gameId, increment, (data) => {
      const { question, options } = data.server;

      setGameQuestion(question);
      setGameOptions(options);
    });
  };

  // Called when the game creator requests the next question
  const handleGameQuestion = (dir) => {
    fetchNextQuestion(true);
  };

  // Called when the page loads to fetch the initial question
  useEffect(() => {
    fetchNextQuestion();

    // Listen for the new question event
    socket.on("new-question", (data) => {
      const { question, options } = data.server;

      setGameQuestion(question);
      setGameOptions(options);
    });

    return () => {
      socket.off("new-question");
    };
  }, []);

  if (isCreator === null) {
    return <div>Loading...</div>;
  }

  return isCreator ? (
    <CreatorScreen
      question={gameQuestion}
      options={gameOptions}
      handleNextQuestion={handleGameQuestion}
    />
  ) : (
    <PlayerScreen question={gameQuestion} options={gameOptions} />
  );
}
