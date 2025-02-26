import { useState, useContext, useEffect } from "react";
import { SocketContext } from "../context/socket";

export const QuestionAnswer = ({ question, options, disabled = false }) => {
  const {socket, isCreator} = useContext(SocketContext);
  const [response, setResponse] = useState(null);
  const [hints, setHints] = useState([]);

  const isAnswerHint = (index) => {
    return hints?.includes(index);
  };

  const handleResponse = (responseId) => {
    if (disabled) return;
    if (isAnswerHint(responseId)) return;

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
    setHints([]);
  }, [question]);

  useEffect(() => {
    socket?.on("client-question-hint", (data) => {
      const { hints } = data;
      setHints(hints);
    });

    return () => {
      socket?.off("client-question-hint");
    };
  }, [socket]);

  const getUpdatedOptionsWithHints = () => {
    return options.map((option, index) => {
      const optionText =
        typeof option === "string" ? option : Object.values(option).join("");
      return {
        text: optionText, // Ensure the option remains a string
        isHint: hints?.includes(index), // Mark as hint if index is in hints array
      };
    });
  };

  return (
    <div className="questionData mt-10 p-2 md:p-2 w-full flex justify-center items-center flex-col">
      <div className="bg-green-500 p-2 border-b-[1px] border-t-[1px] border-gray-300/20 w-full my-3">
        <p className="text-2xl text-center font-kahootQuestion tracking-widest">{question}</p>
      </div>

      <div className="options w-full">
        <ul className="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
          {getUpdatedOptionsWithHints()?.map((option, index) => (
            <li
              key={index}
              id={index}
              onClick={() => handleResponse(index)}
              className={`w-full min-h-20 flex flex-col justify-center border-2 border-gray-800 rounded-md shadow-md text-lg p-2 
              ${option.isHint ? "bg-red-500" : "bg-blue-600"} 
              ${
                isCreator ? "creator-specific-styles" : "player-specific-styles"
              }
              ${
                // Additional conditional styling
                disabled || option.isHint
                  ? "bg-white/40 cursor-default"
                  : response === index
                  ? "bg-green-500"
                  : "hover:bg-blue-400 cursor-pointer"
              }`}
            >
              <p className="font-kahootAnswer">{option.text}</p>
              {option.isHint && (
                <p className="max-w-max bg-black/50 p-0.5 px-4 uppercase italic rounded-full text-sm">
                  removed by creator
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
