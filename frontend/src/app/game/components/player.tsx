"use client";

import { LeaveGame } from "@/app/components/leavegame";
import { Timer } from "@/app/components/timer";
import { QuestionAnswer } from "@/app/components/questionanswer";

type PlayerScreenProps = {
  question: string;
  options: string[];
  timer: number;
};

export const PlayerScreen = ({ question, options, timer }: PlayerScreenProps) => {
  return (
    <div className="container flex flex-col gap-2">
      <div className="bg-white/30 text-white rounded-md">
        <div className="timerCounter w-full flex justify-center p-2">
          <Timer timer={timer} />
        </div>

        <QuestionAnswer
          question={question}
          options={options}
          disabled={timer.toLocaleString().includes("--")}
        />
      </div>

      <LeaveGame className={'md:w-1/2'} />
    </div>
  );
};
