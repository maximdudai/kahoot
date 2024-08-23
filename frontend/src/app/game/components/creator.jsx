import { useState, useContext, useEffect } from "react";

import { Playerlist } from "@/app/components/playerlist";
import { QuestionAnswer } from "@/app/components/questionanswer";
import { Timer } from "@/app/components/timer";
import { SocketContext } from "@/app/context/socket";
import { QuestionAction } from "@/app/utils/question";
import { updatePlayersAnswers, updatePlayerAnswer } from "@/app/utils/player";

export const CreatorScreen = ({ question, options, handleNextQuestion }) => {
  const [playerList, setPlayerList] = useState([]);
  const socket = useContext(SocketContext);

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
    };

    socket?.on("player-answered", handlePlayerAnswered);

    const updatePlayerListWithAnswers = () => {
      const updatedPlayerList = updatePlayersAnswers(localGameData.players);
      setPlayerList(updatedPlayerList);

      localGameData.players = updatedPlayerList;
      localStorage.setItem("game", JSON.stringify(localGameData));
    };

    updatePlayerListWithAnswers();

    return () => {
      socket?.off("player-answered", handlePlayerAnswered);
    };
  }, [socket, question]);

  return (
    <div className="container text-white">
      <div className="gameData w-full flex justify-between items-end">
        <div className="timerCount w-1/4">
          <Timer />
        </div>

        <div className="creatorAcess w-1/3 flex flex-col gap-2">
          <button className="bg-blue-500 p-2 rounded-md shadow-lg hover:bg-blue-500/80">
            End Game
          </button>
          <button className="bg-blue-500 p-2 rounded-md shadow-lg hover:bg-blue-500/80">
            Increase Timer (+10 sec)
          </button>
          <button className="bg-blue-500 p-2 rounded-md shadow-lg hover:bg-blue-500/80">
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

        <div className="playerList w-1/4">
          <Playerlist playerList={playerList} />
        </div>
      </div>

      <div className="gameQuestion">
        <QuestionAnswer question={question} options={options} disabled />
      </div>
    </div>
  );
};
