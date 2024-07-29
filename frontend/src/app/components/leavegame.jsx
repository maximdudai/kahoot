"use client";

import { useRouter } from "next/navigation";
import { useContext } from "react";
import { SocketContext } from "../context/socket";

export const LeaveGame = () => {
  const router = useRouter();
  const socket = useContext(SocketContext);

  const handleLeaveGame = () => {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("socket");
    sessionStorage.removeItem("game");

    socket?.emit("leave-game");
    router.push("/");
  };

  return (
    <div className="mt-1 text-center">
      <button
        className="bg-red-500/30 text-white text-xs uppercase p-2 shadow-md hover:bg-red-500"
        onClick={handleLeaveGame}
      >
        Leave Game
      </button>
    </div>
  );
};
