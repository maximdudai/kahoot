"use client";

import { useState } from "react";

import { LeaveGame } from "@/app/components/leavegame";
import { Timer } from "@/app/components/timer";
import { QuestionAnswer } from "@/app/components/questionanswer";

export const PlayerScreen = () => {
  const [timer, setTimer] = useState(30);
  const [response, setResponse] = useState(null);

  const handleQuestionResponse = (id) => {
    setResponse(id);
  };

  return (
    <div className="container">
      <div className="bg-white/30 text-white rounded-md">
        <Timer seconds={timer} />

        <QuestionAnswer />
      </div>

      <LeaveGame />
    </div>
  );
}
