"use client";

import { useContext, useEffect, useState } from "react";
import { SocketContext } from "@/app/context/socket";
import { CreatorScreen } from "./components/creator";
import { PlayerScreen } from "./components/player";
import { QuestionAction } from "../utils/question";
import { useRouter } from "next/navigation";

export default function Game() {
  const [isCreator, setIsCreator] = useState(null);

  const [gameQuestion, setGameQuestion] = useState(null);
  const [gameOptions, setGameOptions] = useState([]);
  const [gameTimer, setGameTimer] = useState(null);
  const socket = useContext(SocketContext);
  const router = useRouter();

  useEffect(() => {
    const gameData = JSON.parse(localStorage.getItem("game"));

    if (gameData) {
      // Compare creator socket with client socket.id
      const isCreatorSocketEqual = gameData.gameid === socket.id;
      setIsCreator(isCreatorSocketEqual);
    } else {
      console.error("No game data found in localStorage.");
    }
  }, []);

  // Function to fetch the next question, used by the creator
  const fetchNextQuestion = (increment = QuestionAction.MAINTAIN) => {
    const gameData = JSON.parse(localStorage.getItem("game"));
    const gameId = gameData?.gameid;

    socket?.emit("emit-question", gameId, increment, (data) => {
      const { question, options } = data.server;

      setGameQuestion(question);
      setGameOptions(options);
    });
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

    socket.on("timer-update", (data) => {
      setGameTimer(data.timeRemaining ?? "--");
    });

    socket.on("end-game", () => {
      router.push("/results", undefined, { shallow: true });
    });

    return () => {
      socket.off("new-question");
      socket.off("timer-update");
      socket.off("end-game");
    };
  }, []);

  // redirect to rejoin if there is data if not redirect to home
  if(localStorage.getItem("game") === null) {
    router.push("/");
    return null;
  }

  return isCreator ? (
    <CreatorScreen
      question={gameQuestion}
      options={gameOptions}
      timer={gameTimer}
      handleNextQuestion={fetchNextQuestion}
    />
  ) : (
    <PlayerScreen
      question={gameQuestion}
      options={gameOptions}
      timer={gameTimer}
    />
  );
}
