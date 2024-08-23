import { useState, useContext, useEffect } from "react";
import { SocketContext } from "../context/socket";

export const QuestionAnswer = ({ question, options, disabled }) => {
  const [response, setResponse] = useState(null);
  const socket = useContext(SocketContext);

  const handleResponse = (responseId) => {
    if (disabled) return;

    const localGameData = JSON.parse(localStorage.getItem("game"));
    const gameId = localGameData.gameid;

    setResponse(responseId);
    socket?.emit("player-answer", {
      gameid: gameId,
      response: responseId,
    });
  };

  useEffect(() => {
    setResponse(null);
  }, [question])

  return (
    <div className="questionData mt-10 w-full flex justify-center items-center flex-col">
      <div className="bg-green-500 p-2 border-b-[1px] border-t-[1px] border-gray-300/20 w-full my-3">
        <p className="text-2xl text-center">{question}</p>
      </div>

      <div className="options w-full">
        <ul className="w-full grid grid-cols-1 md:grid-cols-2 p-2 gap-2">
          {options?.map((option, index) => (
            <li
              key={index}
              id={index}
              onClick={() => handleResponse(index)}
              className={`w-full min-h-20 flex items-center border-2 border-gray-800 rounded-md shadow-md text-lg p-2 ${
                disabled
                  ? "bg-white/40 cursor-default"
                  : response === index
                  ? "bg-green-500"
                  : "bg-blue-600 hover:bg-blue-400 cursor-pointer"
              }`}
            >
              {option}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
