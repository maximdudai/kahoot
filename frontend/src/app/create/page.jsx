"use client";

import { useState, useRef, useContext } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { FaRegCopy } from "react-icons/fa";
import { TbJson } from "react-icons/tb";
import { Codesnippet } from "@/app/components/codesnippet";

import { generateGameId } from "@/app/utils/game";
import { SocketContext } from "@/app/context/socket";

import './style.css';

export default function CreateNewGame() {
    const [gameErrors, setGameErrors] = useState({
        nickname: "",
        code: "",
        file: "",
        fileType: "",
    });

    const [nickname, setNickname] = useState("");
    const [gameCode, setGameCode] = useState("");
    const [showCodeSnippet, setShowCodeSnippet] = useState(false);
    const snippetRef = useRef(null);
    const [gameFile, setGameFile] = useState(null);
    const [gameSettings, setGameSettings] = useState({
        maxPlayers: -1,
        time: 30,
        gameCode: "",
    });
    const [sendedRequest, setSendedRequest] = useState(false);

    const socket = useContext(SocketContext);
    const router = useRouter();

    const generateGameCode = () => {
        const code = generateGameId();
        setGameCode(code);
        setGameSettings({ ...gameSettings, gameCode: code });
        setGameErrors({ ...gameErrors, code: "" });
    };

    const handleCopyGameCode = async () => {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(gameCode);
                console.log("Game code copied to clipboard");
            } else {
                throw new Error("Clipboard API not supported");
            }
        } catch (error) {
            console.error("Error copying game code:", error);
        }
    };

    const handleFileChange = (e) => {
        setGameFile(e.target.files[0]);
        setGameErrors({ ...gameErrors, file: "", fileType: "" });
    };

    const handleInputNickname = (e) => {
        let nickname = e.target.value;

        if(gameErrors.nickname) {
            setGameErrors({ ...gameErrors, nickname: "" });
        }

        setNickname(nickname);
    };

    // Prevent non-numeric input
    const handleKeyDown = (e) => {
        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Ctrl', 'Shift', 'Alt', 'A', 'a'];
        if (allowedKeys.includes(e.key)) return;

        // Block non-numeric keys
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    };

    const handleGameCodeInput = (e) => {
        let code = e.target.value;

        // Remove any non-digit characters
        code = code.replace(/[^0-9]/g, '');

        // Limit to 6 characters
        if (code.length > 6) {
            code = code.slice(0, 6);
        }

        setGameCode(code);
    };

    const handleCreateGame = async () => {
        // prevent multiple requests
        if (sendedRequest)
            return;

        if (!nickname) {
            setGameErrors({ ...gameErrors, nickname: "Please enter a nickname." });
            return;
        }

        if (!gameCode.length) {
            setGameErrors({ ...gameErrors, code: "Please generate a game code." });
            return;
        }

        if (!gameFile) {
            setGameErrors({ ...gameErrors, file: "Please upload a file." });
            return;
        }
        

        setSendedRequest(true);

        const formData = new FormData();
        formData.append("file", gameFile);

        try {
            const response = await axios.post(process.env.SOCKET_URL + "api/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.success) {
                const newGameSettings = {
                    ...gameSettings,
                    questions: response.data.data.game,
                    totalQuestions: response.data.data.game.length,
                };
                setGameSettings(newGameSettings);

                socket.emit("create-game", newGameSettings, (response) => {
                    localStorage.setItem("game", JSON.stringify(response?.gameData));
                });

                //redirect to waiting page
                router.push("/waiting", undefined, { shallow: true });
            } else {
                setGameCode({ ...gameErrors, fileType: response.data.message });
            }
        } catch (error) {
            console.error("Error creating game:", error);
            setGameErrors({ ...gameErrors, fileType: error.response?.data?.message });
        } finally {
            setSendedRequest(false);
        }
    };

    const handleCodeSnippet = () => {
        setShowCodeSnippet(!showCodeSnippet);
    };

    return (
        <>
        <div className="container md:w-1/2 bg-gradient-to-b from-purple-900 to-black p-4 shadow-2xl rounded-xl border-2 border-yellow-500">
            <h1 className="font-kahoot_monomaniac text-center bg-gradient-to-r from-yellow-400 to-red-500 text-transparent bg-clip-text rounded-md p-3 text-2xl tracking-wide uppercase animate-pulse-slow">
                Create Game
            </h1>
    
            <div className={`creatorNickname my-2 h-[3.5rem] p-2 flex items-center justify-between border-2 ${!gameErrors.nickname ? 'border-gray-600' : 'border-red-500 animate-pulse'} rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all`}>
                <input
                    className="bg-transparent w-full text-white placeholder:text-gray-300 focus:outline-none focus:placeholder:text-gray-400 font-press-start text-sm"
                    type="text"
                    id="nickname"
                    placeholder="Enter Nickname"
                    onChange={handleInputNickname}
                />
            </div>
    
            <div className={`generateGameCode my-2 p-2 flex items-center justify-between border-2 ${!gameErrors.code ? 'border-gray-600' : 'border-red-500 animate-pulse'} rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all`}>
                <input
                    className="bg-transparent w-full text-white placeholder:text-gray-300 focus:outline-none focus:placeholder:text-gray-400 no-arrows font-press-start text-sm"
                    maxLength={6}
                    type="number"
                    id="gamecode"
                    placeholder="Game Code"
                    value={gameCode}
                    onChange={handleGameCodeInput}
                    onKeyDown={handleKeyDown}
                />
                <button
                    className="text-white w-[14rem] px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg hover:scale-105 transition-transform shadow-md"
                    onClick={generateGameCode}
                >
                    Generate Code
                </button>
                {gameCode !== "" && (
                    <button
                        className="text-white w-12 h-10 ml-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg hover:scale-105 transition-transform shadow-md"
                        onClick={handleCopyGameCode}
                    >
                        <FaRegCopy className="m-auto text-lg" />
                    </button>
                )}
            </div>
    
            <div className="gameSettings w-full flex flex-col md:flex-row justify-between gap-4">
                <div className="maxPlayersPerGame w-full md:w-1/2">
                    <h3 className="uppercase text-white text-center text-sm bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg shadow-md">
                        Max Players
                    </h3>
    
                    <div className="maxPlayers my-2 p-2 flex flex-col justify-between border-2 border-gray-600 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all">
                        <div className="totalPlayers">
                            <div className="unlimitedPlayers h-12 flex justify-between text-white uppercase items-center bg-gray-700/50 my-2 px-4 rounded-lg hover:bg-gray-600 transition-all">
                                <label htmlFor="unlimited" className="flex items-center gap-2">
                                    <span className="font-press-start text-sm">Unlimited</span>
                                    <span className="text-xs px-2 bg-yellow-500 text-black rounded-full">Default</span>
                                </label>
                                <input
                                    type="radio"
                                    id="unlimited"
                                    name="maxPlayers"
                                    value="-1"
                                    onChange={(e) => setGameSettings({ ...gameSettings, maxPlayers: e.target.value })}
                                    defaultChecked
                                />
                            </div>
    
                            <div className="10players h-12 flex justify-between text-white uppercase items-center bg-gray-700/50 my-2 px-4 rounded-lg hover:bg-gray-600 transition-all">
                                <label htmlFor="10player" className="font-press-start text-sm">10 Players</label>
                                <input
                                    type="radio"
                                    id="10player"
                                    name="maxPlayers"
                                    value="10"
                                    onChange={(e) => setGameSettings({ ...gameSettings, maxPlayers: e.target.value })}
                                />
                            </div>
                            <div className="20players h-12 flex justify-between text-white uppercase items-center bg-gray-700/50 my-2 px-4 rounded-lg hover:bg-gray-600 transition-all">
                                <label htmlFor="20player" className="font-press-start text-sm">20 Players</label>
                                <input
                                    type="radio"
                                    id="20player"
                                    name="maxPlayers"
                                    value="20"
                                    onChange={(e) => setGameSettings({ ...gameSettings, maxPlayers: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
    
                <div className="timePerQuestion w-full md:w-1/2">
                    <h3 className="uppercase text-white text-center text-sm bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg shadow-md">
                        Time Per Question
                    </h3>
    
                    <div className="time my-2 p-2 flex flex-col justify-between border-2 border-gray-600 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all">
                        <div className="totalTime">
                            <div className="30seconds h-12 flex justify-between text-white uppercase items-center bg-gray-700/50 my-2 px-4 rounded-lg hover:bg-gray-600 transition-all">
                                <label htmlFor="30seconds" className="flex items-center gap-2">
                                    <span className="font-press-start text-sm">30 Seconds</span>
                                    <span className="text-xs px-2 bg-yellow-500 text-black rounded-full">Default</span>
                                </label>
                                <input
                                    type="radio"
                                    id="30seconds"
                                    name="timePerQuestion"
                                    value="30"
                                    onChange={(e) => setGameSettings({ ...gameSettings, time: e.target.value })}
                                    defaultChecked
                                />
                            </div>
    
                            <div className="45seconds h-12 flex justify-between text-white uppercase items-center bg-gray-700/50 my-2 px-4 rounded-lg hover:bg-gray-600 transition-all">
                                <label htmlFor="45seconds" className="font-press-start text-sm">45 Seconds</label>
                                <input
                                    type="radio"
                                    id="45seconds"
                                    name="timePerQuestion"
                                    value="45"
                                    onChange={(e) => setGameSettings({ ...gameSettings, time: e.target.value })}
                                />
                            </div>
    
                            <div className="60seconds h-12 flex justify-between text-white uppercase items-center bg-gray-700/50 my-2 px-4 rounded-lg hover:bg-gray-600 transition-all">
                                <label htmlFor="60seconds" className="font-press-start text-sm">60 Seconds</label>
                                <input
                                    type="radio"
                                    id="60seconds"
                                    name="timePerQuestion"
                                    value="60"
                                    onChange={(e) => setGameSettings({ ...gameSettings, time: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            <div className="questionData">
                <h3 className="uppercase text-white text-center text-sm bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg shadow-md">
                    Questions
                    <span className="text-xs mx-2 px-2 bg-yellow-500 text-black rounded-full">JSON File</span>
                </h3>
    
                <div className={`questions my-2 p-2 flex items-center justify-between border-2 ${!gameErrors.file ? 'border-gray-600' : 'border-red-500 animate-pulse'} rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all`}>
                    <input
                        className="cursor-pointer text-white file:mr-4 file:rounded-full file:border-0 file:bg-green-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-green-600 dark:file:bg-green-600 dark:file:text-white"
                        type="file"
                        id="questions"
                        accept=".json"
                        onChange={handleFileChange}
                        required
                    />
    
                    <button
                        className="text-sm flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 hover:scale-105 transition-transform shadow-md"
                        onClick={handleCodeSnippet}
                    >
                        Code Snippet
                        <TbJson className="text-lg" />
                    </button>
                </div>
            </div>
            {gameErrors.fileType && (
                <div className="errorFileType w-full text-center p-1 mb-2">
                    <span className="text-red-500 font-bold animate-pulse text-sm font-press-start">{gameErrors.fileType}</span>
                </div>
            )}
            <div className="createGame mt-4">
                <button
                    className="bg-gradient-to-r from-green-500 to-teal-500 w-full p-3 rounded-lg text-white tracking-wider uppercase text-lg font-press-start hover:scale-105 transition-transform shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
                    disabled={sendedRequest}
                    onClick={handleCreateGame}
                >
                    Create Game
                </button>
            </div>
        </div>
        {showCodeSnippet && (
            <Codesnippet ref={snippetRef} clickedOutside={handleCodeSnippet} />
        )}
    </>
    );
}
