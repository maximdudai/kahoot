import { useState, useRef, useEffect } from "react";

import axios from "axios";

import { FaRegCopy } from "react-icons/fa";
import { TbJson } from "react-icons/tb";
import { Codesnippet } from "@/app/components/codesnippet";

import { io } from "socket.io-client";

import { generateGameId } from "@/app/utils/gameid";
import { generateUniqueId } from "@/app/utils/playerid";

export const CreateNewGame = ({ updateStep }) => {
  const [gameCode, setGameCode] = useState("");
  const [showCodeSnippet, setShowCodeSnippet] = useState(false);
  const snippetRef = useRef(null);
  const [gameSettings, setGameSettings] = useState({
    maxPlayers: -1,
    time: 30,
    gameCode: '',
    file: null,
  });

  const socket = useRef(null);

  useEffect(() => {
    // Use the actual IP address of the server
    socket.current = io('http://192.168.1.180:5050'); // Replace with your server's actual IP address

    socket.current.on('connect', () => {
      console.log('Connected to the server');

      socket.current.on('client-create-game', (data) => {
        console.log('Received create-game event:', data);
      });

      socket.current.on('player-join', (data) => {
        console.log('Player joined:', data);
        setTotalPlayers((prevPlayers) => [...prevPlayers, data.player]);
        setPlayers((prevPlayers) => prevPlayers + 1);
      });

      socket.current.on('player-left', (data) => {
        setTotalPlayers((prevPlayers) =>
          prevPlayers.filter((player) => player.id !== data.id)
        );
        setPlayers((prevPlayers) => prevPlayers - 1);
      });

      // Example button to join game
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.current.disconnect();
    };
  }, []);

  const generateGameCode = () => {
    const code = generateGameId();
    setGameCode(code);
    setGameSettings({ ...gameSettings, gameCode: code });
  };

  const handleFileChange = (e) => {
    setGameSettings((prevSettings) => ({
      ...prevSettings,
      file: e.target.files[0],
    }));
  };

  const handleCreateGame = async () => {
    const formData = new FormData();
    formData.append('file', gameSettings.file);

    try {
      const response = await axios.post('http://localhost:5050/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        // Set creator id
        const playerid = generateUniqueId();
        const newGameSettings = {
          ...gameSettings,
          creator: playerid,
          questions: response.data.data.game,
        };
        setGameSettings(newGameSettings);

        // Save game settings to local storage
        localStorage.setItem('gameSettings', JSON.stringify(newGameSettings));

        // Update step to waiting for players
        updateStep(1);

        // Emit game settings to server
        console.log('Emitting create-game event');
        socket.current.emit('create-game', newGameSettings);

      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file.');
    }
  };

  const handleCodeSnippet = () => {
    setShowCodeSnippet(!showCodeSnippet);
  };

  return (
    <>
      <div className="container w-1/2 bg-black/50 p-2 shadow-lg">
        <h1 className="text-center bg-white/20 rounded-md p-2 text-white tracking-wide uppercase text-md">
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
          {gameCode && (
            <button
              className="text-white w-12 h-10 ml-2 p-2 bg-white/20 rounded-lg"
              onClick={() => navigator?.clipboard?.writeText(gameCode)}
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

            <button
              className="min-w-max flex items-center gap-2 p-2 rounded-lg bg-white/20 text-white "
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
};
