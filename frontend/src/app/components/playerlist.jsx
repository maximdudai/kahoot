import React, { useState, useEffect } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { SocketContext } from "../context/socket";

export const Playerlist = () => {
    const [playerList, setPlayerList] = useState([]);
    const [localGameData, setLocalGameData] = useState(() => 
        JSON.parse(localStorage.getItem("game")) || {}
    );
    
    useEffect(() => {
        const updatePlayerList = () => {
            const gameData = JSON.parse(localStorage.getItem("game")) || {};
            setLocalGameData(gameData); 
            setPlayerList(gameData.players || []);

            console.log("Playerlist updated", gameData.players);
        };

        // Update player list on mount and listen for updates
        updatePlayerList();
        window.addEventListener("updateGamePlayers", updatePlayerList);
    
        return () => {
            // Cleanup event listener on unmount
            window.removeEventListener("updateGamePlayers", updatePlayerList);
        };
    }, []);

    return (
        playerList && (
            <ul
                className={`flex justify-center flex-wrap w-full gap-2 text-white max-h-80 my-5 pb-3 ${playerList.length ? "border-b-[1px] border-gray-300/30" : ""
                    }`}
                style={{
                    overflowY: "auto",
                    scrollbarColor: "rgba(255, 255, 255, 0.5) rgba(0, 0, 0, 0.5)",
                }}
            >
                {playerList?.map((player, index) => (
                    <li
                        className={`flex flex-col justify-center items-center gap-1 min-w-12 ${player.answer
                            ? "border-2 border-green-500"
                            : "border-[1px] border-gray-300"
                            } rounded-lg p-2`}
                        style={{
                            wordBreak: "break-all",
                        }}
                        key={index}
                    >
                        <FaRegUserCircle className="text-2xl" />
                        <span>{player.username}</span>
                    </li>
                ))}
            </ul>
        )
    );
};
