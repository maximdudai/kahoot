"use client";

import { Playerlist } from "@/app/components/playerlist";
import { SocketContext } from "@/app/context/socket";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { Kahoot } from "@/app/components/title";
import { GameSettings } from "./components/settings";
import { LeaveGame } from "../components/leavegame";

// export const WaitingPlayers = ({ updateStep }) => {
export default function WaitingPlayers() {
    const router = useRouter();
    const { socket, isCreator } = useContext(SocketContext);

    useEffect(() => {

        socket.on("creator-start-game", () => {

            router.push("/game", undefined, { shallow: true });
        });

        return () => {
            socket?.off("creator-start-game");
        };
    }, []);

    const handleStartGame = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }
        socket?.emit("start-game", token);

        router.push("/game", undefined, { shallow: true });
    };

    return (
        <>
            <div className="container p-2 flex flex-col items-center justify-center rounded-md">
                <Kahoot />
                <div className="gameInformation w-full lg:w-1/2">
                    <GameSettings />

                    <div className="playerList w-full">
                        <Playerlist />
                    </div>

                    {isCreator && (
                        <div className="gameControl flex justify-around gap-3 mt-4 py-2">
                            <button
                                className="w-1/3 uppercase text-sm font-semibold tracking-wider shadow-lg bg-green-600/60 text-white px-4 py-2 rounded-md hover:scale-110 hover:bg-green-600"
                                onClick={handleStartGame}
                            >
                                Start Game
                            </button>

                            <LeaveGame
                                className={
                                    "w-1/3 uppercase text-sm font-semibold tracking-wider shadow-lg bg-red-600/60 text-white px-4 py-2 rounded-md hover:scale-110 hover:bg-red-600"
                                }
                                text="Cancel Game"
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
