"use client";

import { useRouter } from "next/navigation";
import { useContext } from "react";
import { SocketContext } from "@/app/context/socket";
import { twMerge } from "tailwind-merge";

type LeaveGameProps = {
  className?: string,
  text?: string
};

export const LeaveGame = ({ className, text = "Leave Game" }: LeaveGameProps) => {
  const router = useRouter();

  const {socket, isCreator} = useContext(SocketContext);

  const handleLeaveGame = () => {

    if (isCreator) {
      const token = localStorage.getItem("token") || "";
      socket?.emit("server-cancel-game", token);
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
