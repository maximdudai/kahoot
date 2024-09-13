'use client'

import { useEffect, useContext } from "react";

import { LeaveGame } from "../components/leavegame";
import { Kahoot } from "../components/title";
import { SocketContext } from "../context/socket";
import { useRouter } from "next/navigation";


export default function GameQueue() {
  const socket = useContext(SocketContext);
  const router = useRouter();

  useEffect(() => {
    socket?.on("player-join-queue", () => {
      router.push("/game", undefined, { shallow: true });
    });

    return () => {
      socket?.off("player-join-queue");
    };
  }, []);

  return (
    <div className="container flex flex-col items-center text-center">
      <Kahoot />

      <div className="bg-white/10 md:w-1/3 text-white text-xl shadow-lg shadow-black rounded-md py-5 p-2">
        <p>You are in queue</p>
        <p>There is an active question, please wait!</p>
      </div>

      <LeaveGame className={"mt-5"} />
    </div>
  );
}
