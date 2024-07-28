import { SocketContext } from "@/app/context/socket";
import { useState, useEffect, useContext } from "react";

export const WaitingPlayers = ({updateStep }) => {
  const [players, setPlayers] = useState(0);
  const [totalPlayers, setTotalPlayers] = useState([]);

  let socket = useContext(SocketContext);

  useEffect(() => {
    const handleJoinGame = (player) => {
      setPlayers((players) => players + 1);
      setTotalPlayers((totalPlayers) => [...totalPlayers, player]);
    };

    const handlePlayerLeft = (playerData) => {

      console.log(playerData);
      
      setPlayers((players) => players - 1);
      setTotalPlayers((totalPlayers) =>
        totalPlayers.filter((player) => player.socket !== playerData.socket)
      );
    };

    if (socket) {
      socket.on('player-join', handleJoinGame);
      socket.on('player-left', handlePlayerLeft);

      // Clean up the event listeners when the component unmounts or socket changes
      return () => {
        socket.off('player-join', handleJoinGame);
        socket.off('player-left', handlePlayerLeft);
      };
    }
  }, [socket, totalPlayers]);

  const handleCancelGame = () => {
    socket.emit("cancel-game");
    updateStep(0);
  };

  return (
    <>
      <div className="container p-2 flex flex-col items-center justify-center bg-white/20 rounded-md shadow-md">
        <div className="waitingTitle">
          {players === 0 ? (
            <h1 className="text-white text-2xl font-semibold">
              Waiting for players...
              <span>
                Total: {players} / 4
              </span>
            </h1>
          ) : (
            <h1 className="text-white text-2xl font-semibold">
              Players joined: {players}
            </h1>
          )}
        </div>
        {players >= 1 && (
          <div className="playersList w-full md:w-1/3">
            <ul className="text-white w-full max-h-80 overflow-y-auto">
              {totalPlayers.map((player, index) => (
                <li className="border-b-2 border-gray-300/20 p-2 mr-1 bg-black/20" key={index}>{player.username}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex flex-col my-3 gap-2 w-1/3 items-center">
          {players >= 1 && (
            <button
              className="w-full shadow-lg bg-green-500 text-white px-4 py-2 rounded-md"
              onClick={() => console.log("Start Game")}
            >
              Start Game
            </button>
          )}

          <button
            className="w-full shadow-lg bg-red-500 text-white px-4 py-2 rounded-md"
            onClick={handleCancelGame}
          >
            Cancel Game
          </button>
        </div>
      </div>
    </>
  );
};
