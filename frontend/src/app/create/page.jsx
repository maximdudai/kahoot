"use client";

import { useState, useRef } from "react";

import { FaRegCopy } from "react-icons/fa";
import { RiUserReceived2Line } from "react-icons/ri";
import { TbJson } from "react-icons/tb";

import { Codesnippet } from "../components/codesnippet";

export default function CreateGame() {
  const [username, setUsername] = useState("");
  const [gameCode, setGameCode] = useState("");

  const [showCodeSnippet, setShowCodeSnippet] = useState(false);
  const snippetRef = useRef(null);

  const [gameSettings, setGameSettings] = useState({
    maxPlayers: -1,
    time: 30,
    file: null,
  });

  const generateGameCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000);
    setGameCode(code);
  };

  const handleCreateGame = () => {
    if (!username || !gameCode) {
      alert("Please fill in all fields");
      return;
    }
  };

  const handleCodeSnippet = () => {
    setShowCodeSnippet(!showCodeSnippet);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      alert("Please select a file");
      return;
    }
    if (file.type !== "application/json") {
      alert("Please select a json file");
      return;
    }
    setGameSettings({ ...gameSettings, file });
  };

  return (
    <>
      <div className="container w-1/2 bg-black/50 p-2 shadow-lg">
        <h1 className="text-center bg-white/20 rounded-md p-2 text-white tracking-wide uppercase text-md">
          Create Game
        </h1>

        <div className="authUsername my-2 p-2 flex items-center justify-between border-[1px] border-gray-400 rounded-md">
          <input
            className="bg-transparent w-full text-white placeholder:text-white focus:outline-none focus:placeholder:text-gray-400"
            type="text"
            id="username"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <RiUserReceived2Line className="w-10 h-auto p-2 text-black bg-white rounded-md" />
        </div>

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
          {gameCode && (
            <button
              className="text-white w-12 h-10 ml-2 p-2 bg-white/20 rounded-lg"
              onClick={() => navigator.clipboard.writeText(gameCode)}
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
                  <label htmlFor="unlimited">
                    Unlimited
                    <span className="text-xs mx-2 px-2 bg-white/20 rounded-lg">
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
                  <label htmlFor="30seconds">
                    30 Sec
                    <span className="text-xs mx-2 px-2 bg-white/20 rounded-lg">
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

            <button className="min-w-max flex items-center gap-2 p-2 rounded-lg bg-white/20 text-white " onClick={handleCodeSnippet}>
              Code Snippet
              <TbJson />
            </button>
          </div>
        </div>

        <div className="createGame">
          <button
            className="bg-green-500 w-full p-2 rounded-md text-white tracking-wider uppercase"
            onClick={handleCreateGame}
          >
            Create Game
          </button>
        </div>
      </div>
      {showCodeSnippet && <Codesnippet ref={snippetRef} clickedOutside={handleCodeSnippet} />}
    </>
  );
}
