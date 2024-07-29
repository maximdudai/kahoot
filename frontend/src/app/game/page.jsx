"use client";

import { useContext, useEffect, useState } from "react";
import { SocketContext } from "@/app/context/socket";
import { CreatorScreen } from "./components/creator";
import { PlayerScreen } from "./components/player";

export default function Game() {
  const socket = useContext(SocketContext);
  const [isCreator, setIsCreator] = useState(null);

  useEffect(() => {
    if (socket) {
      const isGameCreator = sessionStorage.getItem("creator");
      setIsCreator(socket.id === isGameCreator);
    }
  }, [socket]);

  console.log(isCreator);

  if (isCreator === null) {
    return <div>Loading...</div>; // Or any loading indicator
  }

  return !isCreator ? <CreatorScreen /> : <PlayerScreen />;
}
