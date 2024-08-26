"use client";

import { useRouter } from "next/navigation";
import { useContext } from "react";
import { SocketContext } from "@/app/context/socket";
import { isGameCreator } from "@/app/utils/player";
import { twMerge } from "tailwind-merge";

export const LeaveGame = ({ className, text = "Leave Game" }) => {
  const router = useRouter();
  const socket = useContext(SocketContext);

  const handleLeaveGame = () => {
    const isCreator = isGameCreator(socket?.id);

    if (isCreator) {
      socket?.emit("server-cancel-game");
    } else {
      socket?.emit("leave-game");

      localStorage.removeItem("game");
      localStorage.removeItem("username");
      localStorage.removeItem("socket");
    }

    router.push("/");
  };

  return (
    <button
      className={twMerge(
        `bg-red-500/30 text-white text-xs uppercase p-2 shadow-md hover:bg-red-500`,
        className
      )}
      onClick={handleLeaveGame}
    >
      {text}
    </button>
  );
};
