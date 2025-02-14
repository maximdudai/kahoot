import { useEffect, useState } from "react";

import { GrGroup } from "react-icons/gr";
import { MdOutlinePassword } from "react-icons/md";
import { IoIosTimer, IoIosInfinite } from "react-icons/io";
import { GoQuestion } from "react-icons/go";

export const GameSettings = () => {
    const [gameData, setGameData] = useState(() => JSON.parse(localStorage.getItem("game")) || {});
    const [playerList, setPlayerList] = useState([]);

    useEffect(() => {
        const updatePlayerList = () => {
            const gameData = JSON.parse(localStorage.getItem("game")) || {};
            setGameData(gameData);
            setPlayerList(gameData.players || []);
        };

        // Add event listener
        window.addEventListener("updateGamePlayers", updatePlayerList);

        return () => {
            // Cleanup event listener on unmount
            window.removeEventListener("updateGamePlayers", updatePlayerList);
        };
    }, []);

    return (
        gameData && (
            <div className="flex flex-wrap justify-center lg:justify-between gap-3 text-white text-2xl border-y-[1px] border-gray-300/30 py-4 my-4">
                <div className="w-28 h-auto flex gap-3 flex-col items-center justify-center border-2 border-white/50 rounded-lg p-2">
                    <GrGroup className="bg-white/40 w-1/2 h-1/2 p-2 rounded-lg shadow-inner shadow-white/50" />
                    <span className="font-kahoot tracking-widest flex items-center">
                        {playerList.length} / {gameData?.gameSettings?.maxPlayers === -1 ?
                            <IoIosInfinite className="text-white" /> :
                            gameData?.gameSettings?.maxPlayers
                        }
                    </span>
                </div>
                <div className="w-28 h-auto flex gap-3 flex-col items-center justify-center border-2 border-white/50 rounded-lg p-2">
                    <MdOutlinePassword className="bg-white/40 w-1/2 h-1/2 p-2 rounded-lg shadow-inner shadow-white/50" />
                    <span className="font-kahoot tracking-widest">
                        {gameData?.gameSettings?.gameCode}
                    </span>
                </div>
                <div className="w-28 h-auto flex gap-3 flex-col items-center justify-center border-2 border-white/50 rounded-lg p-2">
                    <IoIosTimer className="bg-white/40 w-1/2 h-1/2 p-2 rounded-lg shadow-inner shadow-white/50" />
                    <span className="font-kahoot tracking-widest">
                        {gameData?.gameSettings?.time} s
                    </span>
                </div>
                <div className="w-28 h-auto flex gap-3 flex-col items-center justify-center border-2 border-white/50 rounded-lg p-2">
                    <GoQuestion className="bg-white/40 w-1/2 h-1/2 p-2 rounded-lg shadow-inner shadow-white/50" />
                    <span className="font-kahoot tracking-widest">
                        {gameData?.gameSettings?.totalQuestions}
                    </span>
                </div>
            </div>
        )
    );
};
