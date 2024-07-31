"use client";

import { useState, useEffect, useContext } from "react";

import { LeaveGame } from "@/app/components/leavegame";
import { Timer } from "@/app/components/timer";
import { QuestionAnswer } from "@/app/components/questionanswer";
import { SocketContext } from "@/app/context/socket";

export const PlayerScreen = ({ question, options }) => {
  const [timer, setTimer] = useState();
  const [response, setResponse] = useState(null);
  const socket = useContext(SocketContext);

  const handleQuestionResponse = (id) => {
    setResponse(id);

    socket?.emit("question-response", {});
  };

  return (
    <div className="container">
      <div className="bg-white/30 text-white rounded-md">
        <div className="timerCounter w-full flex justify-center p-2">
          <Timer seconds={timer} />
        </div>

        <QuestionAnswer
          question={question}
          options={options}
          onResponse={handleQuestionResponse}
          disabled={timer}
        />
      </div>

      <LeaveGame />
    </div>
  );
};
