"use client";

import { useState, useRef, useContext } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";

import { FaRegCopy } from "react-icons/fa";
import { TbJson } from "react-icons/tb";
import { Codesnippet } from "@/app/components/codesnippet";

import { generateGameId } from "@/app/utils/game";
import { SocketContext } from "@/app/context/socket";

export default function CreateNewGame() {
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
  };

  const handleCreateGame = async () => {
    // prevent multiple requests
    if (sendedRequest)
      return;

    if (!gameFile) {
      alert("Please upload a file.");
      return;
    }

    if (!gameCode.length) {
      alert("Please generate a game code.");
      return;
    }

    setSendedRequest(true);

    const formData = new FormData();
    formData.append("file", gameFile);

    try {
      const isProduction = process.env.NODE_ENV === "production";
      const url = isProduction ? process.env.NEXT_PUBLIC_SOCKET_URL : "http://localhost:4000/api/upload";

      const response = await axios.post(url, formData, {
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
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file.");
    } finally {
      setSendedRequest(false);
    }
  };

  const handleCodeSnippet = () => {
    setShowCodeSnippet(!showCodeSnippet);
  };

  return (
    <>
      <div className="container md:w-1/2 bg-black/50 p-2 shadow-lg">
        <h1 className="font-kahoot_monomaniac text-center bg-white/20 rounded-md p-2 text-white tracking-wide uppercase">
          Create Game
        </h1>

        <div className="generateGameCode my-2 p-2 flex items-center justify-between border-[1px] border-gray-400 rounded-md">
          <input
            className="bg-transparent w-full text-white placeholder:text-white focus:outline-none focus:placeholder:text-gray-400"
            type="text"
            id="gamecode"
            placeholder="Game Code"
            value={gameCode}
            onChange={(e) => setGameCode(e.target.value)}
            disabled
          />
          <button
            className="text-white min-w-max p-2 bg-white/20 rounded-lg"
            onClick={generateGameCode}
          >
            Generate Code
          </button>
          {gameCode !== "" && (
            <button
              className="text-white w-12 h-10 ml-2 p-2 bg-white/20 rounded-lg"
              onClick={handleCopyGameCode}
            >
              <FaRegCopy className="m-auto" />
            </button>
          )}
        </div>

        <div className="gameSettings w-full flex justify-between gap-2">
          <div className="maxPlayersPerGame w-1/2">
            <h3 className="uppercase text-white text-center text-sm bg-white/20 p-2 rounded-md">
              Max Players
            </h3>

            <div className="maxPlayers my-2 p-2 flex flex-col justify-between border-[1px] border-gray-400 rounded-md">
              <div className="totalPlayers">
                <div className="unlimitedPlayers h-10 flex justify-between text-white uppercase items-center bg-white/20 my-2 px-2 rounded-md">
                  <label
                    htmlFor="unlimited"
                    className="flex flex-col lg:flex-row lg:items-center"
                  >
                    <span>Unlimited</span>
                    <span className="text-xs mb-1 lg:m-0 lg:mx-1 lg:px-2 text-center bg-white/20 rounded-lg">
                      by default
                    </span>
                  </label>

                  <input
                    type="radio"
                    id="unlimited"
                    name="maxPlayers"
                    value="-1"
                    onChange={(e) =>
                      setGameSettings({
                        ...gameSettings,
                        maxPlayers: e.target.value,
                      })
                    }
                    defaultChecked
                  />
                </div>

                <div className="10players h-10 flex justify-between text-white uppercase items-center bg-white/20 my-2 px-2 rounded-md">
                  <label htmlFor="10player">10 Players</label>

                  <input
                    type="radio"
                    id="10player"
                    name="maxPlayers"
                    value="10"
                    onChange={(e) =>
                      setGameSettings({
                        ...gameSettings,
                        maxPlayers: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="20players h-10 flex justify-between text-white uppercase items-center bg-white/20 my-2 px-2 rounded-md">
                  <label htmlFor="20player">20 Players</label>

                  <input
                    type="radio"
                    id="20player"
                    name="maxPlayers"
                    value="20"
                    onChange={(e) =>
                      setGameSettings({
                        ...gameSettings,
                        maxPlayers: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="timePerQuestion w-1/2">
            <h3 className="uppercase text-white text-center text-sm bg-white/20 p-2 rounded-md">
              Time Per Question
            </h3>

            <div className="time my-2 p-2 flex flex-col justify-between border-[1px] border-gray-400 rounded-md">
              <div className="totalTime">
                <div className="30seconds h-10 flex justify-between text-white uppercase items-center bg-white/20 my-2 px-2 rounded-md">
                  <label
                    htmlFor="30seconds"
                    className="flex flex-col lg:flex-row lg:items-center"
                  >
                    <span>30 seconds</span>
                    <span className="text-xs mb-1 lg:m-0 lg:mx-1 lg:px-2 text-center bg-white/20 rounded-lg">
                      by default
                    </span>
                  </label>
                  <input
                    type="radio"
                    id="30seconds"
                    name="timePerQuestion"
                    value="30"
                    onChange={(e) =>
                      setGameSettings({
                        ...gameSettings,
                        time: e.target.value,
                      })
                    }
                    defaultChecked
                  />
                </div>

                <div className="45seconds h-10 flex justify-between text-white uppercase items-center bg-white/20 my-2 px-2 rounded-md">
                  <label htmlFor="45seconds">45 Seconds</label>
                  <input
                    type="radio"
                    id="45seconds"
                    name="timePerQuestion"
                    value="45"
                    onChange={(e) =>
                      setGameSettings({
                        ...gameSettings,
                        time: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="60seconds h-10 flex justify-between text-white uppercase items-center bg-white/20 my-2 px-2 rounded-md">
                  <label htmlFor="60seconds">60 Seconds</label>
                  <input
                    type="radio"
                    id="60seconds"
                    name="timePerQuestion"
                    value="60"
                    onChange={(e) =>
                      setGameSettings({
                        ...gameSettings,
                        time: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="questionData">
          <h3 className="uppercase text-white text-center text-sm bg-white/20 p-2 rounded-md">
            Questions
            <span className="text-xs mx-2 px-2 bg-white/20 rounded-lg">
              json file
            </span>
          </h3>

          <div className="questions my-2 p-2 flex items-center justify-between border-[1px] border-gray-400 rounded-md">
            <input
              className="bg-transparent w-full text-white placeholder:text-white focus:outline-none focus:placeholder:text-gray-400"
              type="file"
              id="questions"
              accept=".json"
              onChange={handleFileChange}
              required
            />

            <button
              className="text-xs md:min-w-max flex items-center gap-2 p-2 rounded-lg bg-white/20 text-white "
              onClick={handleCodeSnippet}
            >
              Code Snippet
              <TbJson />
            </button>
          </div>
        </div>

        <div className="createGame">
          <button
            className="bg-green-500 w-full p-2 rounded-md text-white tracking-wider uppercase"
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
