"use client";

import React, { useState } from "react";
import { CreateNewGame } from "./components/create"; // Make sure to import your component
import { WaitingPlayers } from "./components/waiting"; // Make sure to import your component

export default function CreateGame() {
  const [createStep, setCreateStep] = useState(0);

  const handleCreateStep = (step) => {
    setCreateStep(step);
  };

  return (
    <>
      {createStep === 0 ? (
        <CreateNewGame updateStep={handleCreateStep} />
      ) : (
        <WaitingPlayers updateStep={handleCreateStep} />
      )}
    </>
  );
}
