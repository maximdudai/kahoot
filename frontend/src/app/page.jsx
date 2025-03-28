"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import Link from "next/link";
import { RiUserReceived2Line } from "react-icons/ri";
import { MdOutlinePassword } from "react-icons/md";
import { Kahoot } from "./components/title";
import { SocketContext } from "./context/socket";

export default function Home() {
    const [username, setUsername] = useState("");
    const [gameCode, setGameCode] = useState("");
    const [sentRequest, setSentRequest] = useState(false);
    const [gameError, setGameError] = useState({ error: "", login: false, code: false });
    const router = useRouter();
    const { socket, setIsCreator } = useContext(SocketContext);
    const [isAlreadyInGame, setIsAlreadyInGame] = useState(false);

    // Memoize input handler to avoid unnecessary re-renders
    const onInputUpdate = useCallback((e) => {
        const { id, value } = e.target;
        if (id === "username") {
            setUsername(value);
            setGameError((prev) => ({ ...prev, login: false, error: "" }));
        } else if (id === "gameCode") {
            setGameCode(value);
            setGameError((prev) => ({ ...prev, code: false, error: "" }));
        }
    }, []);

    // Centralized function to validate inputs
    const validateInputs = () => {
        if (!username || !gameCode) {
            setGameError((prev) => ({
                ...prev,
                login: !username,
                code: !gameCode,
            }));
            return false;
        }
        return true;
    };

    // Handle joining game with cleaner error handling
    const handleJoinGame = async () => {
        if (sentRequest || !validateInputs()) {
            console.log("Invalid inputs or request already sent");
            return;
        }

        setSentRequest(true);
        const token = localStorage.getItem("token");

        try {
            socket?.emit(
                "join-game",
                { gameCode, username, token: token },
                (response) => {
                    console.log('join game response', response);
                    if (response && !response.success) {
                        setGameError((prev) => ({ ...prev, error: response.error || "Unknown error" }));
                        setSentRequest(false);
                        return;
                    }

                    if (response.isCreator) {
                        setIsCreator(true);
                    }

                    localStorage.setItem("username", username);
                    localStorage.setItem("token", response.token);
                    localStorage.setItem("game", JSON.stringify(response.gameData));
                    router.push(response.inQueue ? "/queue" : "/waiting", undefined, { shallow: true });
                }
            );
        } catch (error) {
            console.error("Error joining game:", error);
            setGameError((prev) => ({ ...prev, error: "Failed to join game" }));
        } finally {
            setSentRequest(false);
        }
    };

    const attemptAutoJoin = useCallback(() => {
        if (!socket || isAlreadyInGame) {
            console.log("Skipping auto-join: already in game or no socket");
            return;
        }

        const localGameData = JSON.parse(localStorage.getItem("game") || "null");
        const storedUsername = localStorage.getItem("username");
        const token = localStorage.getItem("token");
        const storedGameCode = localGameData?.gameSettings?.gameCode;

        if (!localGameData || !storedGameCode || !storedUsername || !token) {
            console.log("Missing required data, skipping auto-join");
            return;
        }

        console.log("Attempting to join game with:", { gameCode: storedGameCode, username: storedUsername, token });

        socket.emit("join-game", { gameCode: storedGameCode, username: storedUsername, token }, (response) => {
            console.log('auto join game response', response);
            if (!response?.success) {
                if (response.error === "Player already in game") {
                    setIsAlreadyInGame(true);
                }
                localStorage.clear();
                return;
            }

            setIsAlreadyInGame(true); // Mark as in game after successful join
            if (response.isCreator) {
                setIsCreator(true);
            }

            localStorage.setItem("username", storedUsername);
            localStorage.setItem("token", response.token);
            localStorage.setItem("game", JSON.stringify(response.gameData));
            router.push(response.inQueue ? "/queue" : "/waiting", undefined, { shallow: true });
        });
    }, [socket, isAlreadyInGame]); // Ensure all dependencies are listed

    useEffect(() => {
        attemptAutoJoin();
    }, [attemptAutoJoin]);


    // Helper to check if there's an error
    const hasError = gameError.login || gameError.code || gameError.error;

    return (
        <div className="text-black w-full md:w-1/2 xl:w-1/3 p-2 flex flex-col gap-3 justify-center rounded-md">
            <Kahoot />
            <InputField
                id="username"
                placeholder="Username"
                value={username}
                onChange={onInputUpdate}
                hasError={gameError.login}
                maxLength={15}
                Icon={RiUserReceived2Line}
            />
            <InputField
                id="gameCode"
                placeholder="Code"
                value={gameCode}
                onChange={onInputUpdate}
                hasError={gameError.code}
                Icon={MdOutlinePassword}
            />
            {hasError && (
                <ErrorMessages
                    loginError={gameError.login}
                    codeError={gameError.code}
                    generalError={gameError.error}
                />
            )}
            <div className="gameButtons flex flex-col md:flex-row justify-center gap-4 cursor-pointer">
                <button
                    className="bg-emerald-500 w-full lg:w-1/3 uppercase tracking-widest font-bold text-white p-2 rounded-md hover:scale-110 transform transition-all disabled:opacity-50"
                    disabled={sentRequest}
                    onClick={handleJoinGame}
                >
                    Join
                </button>
                <Link
                    href="/create"
                    className="w-full lg:w-1/3 text-center uppercase tracking-widest p-2 rounded-md text-green-500 hover:bg-emerald-500 hover:text-white hover:scale-110 transform transition-all"
                >
                    <span className="font-bold">Create Game</span>
                </Link>
            </div>
        </div>
    );
}

// Reusable Input Component
function InputField({ id, placeholder, value, onChange, hasError, maxLength, Icon }) {
    return (
        <div
            className={`font-bold text-xl p-2 flex items-center justify-between border-8 ${!hasError ? "border-green-500" : "border-red-500 animate-pulse"
                } rounded-full`}
        >
            <input
                className="bg-transparent w-full text-white placeholder:text-white px-2 focus:outline-none focus:placeholder:text-gray-400"
                type="text"
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                maxLength={maxLength}
                required
            />
            <Icon className={`w-10 h-full ${!hasError ? "text-green-500" : "text-red-500"}`} />
        </div>
    );
}

// Reusable Error Messages Component
function ErrorMessages({ loginError, codeError, generalError }) {
    return (
        <div className="errorMessages text-white w-full text-center p-2 rounded-md bg-red-600/40">
            <div className="errorTitle mb-2 w-full font-bold border-b-[1px] border-gray-800/20">
                Something went wrong!
            </div>
            {loginError && <div className="errorText font-semibold py-1 text-md">Username is required!</div>}
            {codeError && <div className="errorText font-semibold py-1 text-md">Game code is required!</div>}
            {generalError && <div className="errorText font-semibold py-1 text-md">{generalError}</div>}
        </div>
    );
}