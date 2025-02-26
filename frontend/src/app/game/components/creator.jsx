import { useState, useContext, useEffect } from "react";

import { Playerlist } from "@/app/components/playerlist";
import { QuestionAnswer } from "@/app/components/questionanswer";
import { Timer } from "@/app/components/timer";
import { SocketContext } from "@/app/context/socket";
import { QuestionAction } from "@/app/utils/question";
import { updatePlayersAnswers } from "@/app/utils/player";
import { LeaveGame } from "@/app/components/leavegame";

export const CreatorScreen = ({ question, options, timer, handleNextQuestion }) => {
  const [playerList, setPlayerList] = useState([]);
  const {socket} = useContext(SocketContext);

  useEffect(() => {
    const localGameData = JSON.parse(localStorage.getItem("game"));
    if (localGameData) {
      setPlayerList(localGameData.players || []);
    }

    const handlePlayerAnswered = (data) => {
      const { socketId } = data;

      const updatedPlayerList = localGameData.players.map((player) =>
        player.socket === socketId ? { ...player, answer: true } : player
      );

      setPlayerList(updatedPlayerList);

      localGameData.players = updatedPlayerList;
      localStorage.setItem("game", JSON.stringify(localGameData));

      const event = new Event("updateGamePlayers");
      window.dispatchEvent(event);
    };

    socket?.on("player-answered", handlePlayerAnswered);

    const updatePlayerListWithAnswers = () => {
      const updatedPlayerList = updatePlayersAnswers(localGameData.players);
      setPlayerList(updatedPlayerList);

      localGameData.players = updatedPlayerList;
      localStorage.setItem("game", JSON.stringify(localGameData));

      const event = new Event("updateGamePlayers");
      window.dispatchEvent(event);
    };

    updatePlayerListWithAnswers();

    return () => {
      socket?.off("player-answered", handlePlayerAnswered);
    };
  }, [socket, question]);

  const handleQuestionHint = () => {
    const localGameData = JSON.parse(localStorage.getItem("game"));

    socket?.emit("question-hint", { gameid: localGameData.gameid });
  };

  const handleIncreaseTimer = () => {
    const localGameData = JSON.parse(localStorage.getItem("game"));

    socket?.emit("increase-timer", { gameid: localGameData.gameid });
  }

  return (
    <div className="container h-full bg-white/10 p-2 text-white flex flex-col">
      <div className="gameData w-full flex flex-col items-center md:flex-row md:justify-between md:items-end">
        <div className="timerCount py-5">
          <Timer timer={timer} />
        </div>

        <div className="creatorAcess w-full p-2 md:p-0 md:w-1/3 flex flex-col gap-2">
          <LeaveGame className={"bg-blue-500 p-2 rounded-md shadow-lg hover:bg-blue-500/80"} text="End Game" />
          <button className="bg-blue-500 p-2 rounded-md shadow-lg hover:bg-blue-500/80"
            onClick={handleIncreaseTimer}
          >
            Increase Timer (+10 sec)
          </button>
          <button className="bg-blue-500 p-2 rounded-md shadow-lg hover:bg-blue-500/80"
            onClick={handleQuestionHint}
          >
            Give a hint (removing an option)
          </button>
          <div className="manageQuestion flex gap-2 justify-between">
            <button
              className="bg-red-600/60 w-full p-2 rounded-md shadow-lg hover:bg-red-600"
              onClick={() => handleNextQuestion(QuestionAction.DECREMENT)}
            >
              Previous Question
            </button>
            <button
              className="bg-red-600/60 w-full p-2 rounded-md shadow-lg hover:bg-red-600"
              onClick={() => handleNextQuestion(QuestionAction.INCREMENT)}
            >
              Next Question
            </button>
          </div>
        </div>

        <div className="playerList">
          <Playerlist />
        </div>
      </div>

      <div className="gameQuestion">
        <QuestionAnswer question={question} options={options} disabled />
      </div>
    </div>
  );
};
