"use client";

import { useContext, useEffect, useState } from "react";
import { SocketContext } from "@/app/context/socket";
import { CreatorScreen } from "./components/creator";
import { PlayerScreen } from "./components/player";
import { QuestionAction } from "../utils/question";
import { useRouter } from "next/navigation";

export default function Game() {

  const [gameQuestion, setGameQuestion] = useState(null);
  const [gameOptions, setGameOptions] = useState([]);
  const [gameTimer, setGameTimer] = useState(null);
  const { socket, isCreator } = useContext(SocketContext);
  const router = useRouter();


  // Function to fetch the next question, used by the creator
  const fetchNextQuestion = (increment = QuestionAction.MAINTAIN) => {
    const gameData = JSON.parse(localStorage.getItem("game"));
    const gameId = gameData?.gameid;

    socket?.emit("emit-question", gameId, increment, (data) => {
      try {
        const { question, options } = data.server;

        setGameQuestion(question);
        setGameOptions(options);
      } catch (error) {
        console.error("Error fetching next question", error);
      }
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
  if (localStorage.getItem("game") === null) {
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
