'use client'

import { useContext, useEffect } from "react"
import { useRouter } from "next/navigation";
import { SocketContext } from "@/app/context/socket";
import { LeaveGame } from "@/app/components/leavegame";

export default function Join() {
  const socket = useContext(SocketContext);
  const router = useRouter();

  useEffect(() => {

    socket?.on('game-start', ({ }) => {
      
      router.push('/game');
    });

    return () => {
      socket?.off('game-start');
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