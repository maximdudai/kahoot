"use client";

import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { RiUserReceived2Line } from "react-icons/ri";
import { MdOutlinePassword } from "react-icons/md";
import { SocketContext } from "./context/socket";
import { Kahoot } from "./components/title";

import { PiWarningCircleThin } from "react-icons/pi";


export default function Home() {
    const [username, setUsername] = useState("");
    const [gameCode, setGameCode] = useState("");
    const router = useRouter();
    const [sentRequest, setSentRequest] = useState(false);
    const socket = useContext(SocketContext);

    const [gameError, setGameError] = useState({
        error: "",
        login: false,
        code: false
    });

    const onInputUpdate = (e) => {
        if (e.target.id === "username") {
            setUsername(e.target.value);
            setGameError((prev) => ({ ...prev, login: false, error: "" }));
        } else if (e.target.id === "gameCode") {
            setGameCode(e.target.value);
            setGameError((prev) => ({ ...prev, code: false, error: "" }));
        }
    }


    const handleJoinGame = () => {
        if (sentRequest) return;

        if (username === "" || gameCode === "") {
            setGameError((prev) => ({
                ...prev,
                login: username === "",
                code: gameCode === ""
            }));
            return;
        }

        setSentRequest(true);

        try {
            socket?.emit("join-game", { gameCode, username }, (response) => {
                if (!response?.success) {
                    setGameError((prev) => ({ ...prev, error: "Game not found!" }));
                    return;
                }

                localStorage.setItem("username", username);
                localStorage.setItem("socket", socket.id);
                localStorage.setItem("game", JSON.stringify(response.gameData));

                router.push(response.inQueue ? "/queue" : "/waiting", undefined, { shallow: true });
            });
        } catch (e) {
            console.error(e);
        } finally {
            setSentRequest(false);
        }
    };

    // auto join game if user has valid game data in local storage
    useEffect(() => {
        const localGameData = JSON.parse(localStorage.getItem("game"));
        const storedUsername = localStorage.getItem("username") || 'creator';
        const gameCode = localGameData?.gameSettings?.gameCode;

        if (!localGameData || !gameCode) return;

        if (!socket) return;

        socket.emit("join-game", { gameCode, username: storedUsername }, (response) => {
            if (!response?.success) return;

            localStorage.setItem("username", storedUsername);
            localStorage.setItem("socket", socket.id);
            localStorage.setItem("game", JSON.stringify(response.gameData));

            router.push(response.inQueue ? "/queue" : "/waiting", undefined, { shallow: true });
        });
    }, [socket]);

    const isAuthHasError = () => gameError.login || gameError.code || gameError.error !== "";
    return (
        <div className="text-black w-full md:w-1/2 xl:w-1/3 p-2 flex flex-col gap-3 justify-center rounded-md">
            <Kahoot />
            <div className={`authUsername font-bold text-xl p-2 flex items-center justify-between border-8 ${!gameError.login ? 'border-green-500' : 'border-red-500 animate-pulse'} rounded-full`}>
                <input
                    className="bg-transparent w-full text-white placeholder:text-white px-2 focus:outline-none focus:placeholder:text-gray-400"
                    type="text"
                    id="username"
                    placeholder="Username"
                    onChange={(e) => onInputUpdate(e)}
                    maxLength="15"
                    required
                />
                <RiUserReceived2Line className={`w-10 h-full ${!gameError.login ? 'text-green-500' : 'text-red-500'}`} />
            </div>

            <div className={`gameCode font-bold text-xl p-2 flex items-center justify-between border-8 ${!gameError.code ? 'border-green-500' : 'border-red-500 animate-pulse'} rounded-full`}>
                <input
                    className="bg-transparent w-full text-white placeholder:text-white px-2 focus:outline-none focus:placeholder:text-gray-400"
                    type="text"
                    id="gameCode"
                    placeholder="Code"
                    onChange={(e) => onInputUpdate(e)}
                    required
                />
                <MdOutlinePassword className={`w-10 h-full ${!gameError.code ? 'text-green-500' : 'text-red-500'}`} />
            </div>
            {
                isAuthHasError() &&
                <div className="errorMessages text-white w-full text-center p-2 rounded-md bg-red-600/40">
                    <div className="errorTitle mb-2 w-full font-bold border-b-[1px] border-gray-800/20">Something went wrong!</div>
                    {gameError.login && <div className="errorText font-semibold py-1 text-md">Username is required!</div>}
                    {gameError.code && <div className="errorText font-semibold py-1 text-md">Game code is required!</div>}
                    {gameError.error && <div className="errorText font-semibold py-1 text-md">Game not found!</div>}
                </div>
            }
            <div className="gameButtons flex flex-col md:flex-row justify-center gap-4 cursor-pointer">
                <button
                    className="bg-emerald-500 w-full lg:w-1/3 uppercase tracking-widest font-bold text-white p-2 rounded-md hover:scale-110 transform transition-all"
                    disabled={sentRequest}
                    onClick={handleJoinGame}
                >
                    Join
                </button>
                <Link
                    href="/create"
                    className="w-full lg:w-1/3 text-center uppercase tracking-widest p-2 rounded-md text-green-500 hover:bg-emerald-500 hover:text-white hover:scale-110 transform transition-all "
                >
                    <span className="font-bold">Create Game</span>
                </Link>
            </div>
        </div>
    );
}
