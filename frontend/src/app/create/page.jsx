"use client";

import React, { useState, useRef, useEffect } from "react";
import { CreateNewGame } from "./components/create"; // Make sure to import your component
import { WaitingPlayers } from "./components/waiting"; // Make sure to import your component

import { io } from "socket.io-client";

export default function CreateGame() {
  const [createStep, setCreateStep] = useState(0);
  
  const socket = useRef(null);

  useEffect(() => {
    // Initialize the socket connection
    socket.current = io("http://192.168.1.180:5050"); // Replace with your server's actual IP address

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const handleCreateStep = (step) => {
    setCreateStep(step);
  };

  return (
    <>
      {createStep === 0 ? (
        <CreateNewGame socket={socket} updateStep={handleCreateStep} />
      ) : (
        <WaitingPlayers socket={socket} updateStep={handleCreateStep} />
      )}
    </>
  );
}
