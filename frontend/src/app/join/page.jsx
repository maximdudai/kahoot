'use client'

import { useContext, useEffect } from "react"
import { useRouter } from "next/navigation";
import { SocketContext } from "@/app/context/socket";
import { LeaveGame } from "@/app/components/leavegame";

export default function Join() {
  const socket = useContext(SocketContext);
  const router = useRouter();

  useEffect(() => {

    const cancelGame = () => {
      alert("Game has been cancelled.");
      
      router.push("/", undefined, { shallow: true });
    }
    socket?.on("cancel-game", cancelGame);

    socket?.on('creator-start-game', () => {
      
      router.push('/game', undefined, { shallow: true });
    });

    return () => {
      socket?.off('game-start');
      socket?.off("cancel-game", cancelGame);
    }
  }, []);

  return (
    <div className="waitingForStarting">
      <div className="bg-white/20 p-5 rounded-md shadow-lg text-white">
        Waiting for game to start...
      </div>

      <LeaveGame />
    </div>
  )
}