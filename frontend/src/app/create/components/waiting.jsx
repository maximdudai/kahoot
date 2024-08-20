import { Playerlist } from "@/app/components/playerlist";
import { SocketContext } from "@/app/context/socket";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";

export const WaitingPlayers = ({ updateStep }) => {
  const [players, setPlayers] = useState(0);
  const [totalPlayers, setTotalPlayers] = useState([]);
  let router = useRouter();

  let socket = useContext(SocketContext);

  useEffect(() => {
    const handleJoinGame = (player) => {
      setPlayers((players) => players + 1);
      setTotalPlayers((totalPlayers) => [...totalPlayers, player]);
      
      // Update localStorage with the new player added
      const localGameData = JSON.parse(localStorage.getItem("game"));
      localGameData.players.push(player);
      localStorage.setItem("game", JSON.stringify(localGameData)); // Save back to localStorage
    };

    const handlePlayerLeft = (playerData) => {
      const newTotalPlayers = totalPlayers.filter((player) => player.socket !== playerData.socket);
      
      setPlayers((players) => players - 1);
      setTotalPlayers(newTotalPlayers);

      // Update localStorage with the player removed
      const localGameData = JSON.parse(localStorage.getItem("game"));
      localGameData.players = newTotalPlayers;
      localStorage.setItem("game", JSON.stringify(localGameData));
    };

    if (socket) {
      socket?.on('player-join', handleJoinGame);
      socket?.on('player-left', handlePlayerLeft);

      // Clean up the event listeners when the component unmounts or socket changes
      return () => {
        socket?.off('player-join', handleJoinGame);
        socket?.off('player-left', handlePlayerLeft);
      };
    }
  }, []);

  const handleCancelGame = () => {
    socket?.emit("cancel-game");
    updateStep(0);
  };

  const handleStartGame = () => {
    socket?.emit("start-game");

    router.push("/game", undefined, { shallow: true });
  }

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
            <Playerlist players={totalPlayers} />
          </div>
        )}
        <div className="flex flex-col my-3 gap-2 w-1/3 items-center">
          {players >= 1 && (
            <button
              className="w-full shadow-lg bg-green-500 text-white px-4 py-2 rounded-md"
              onClick={handleStartGame}
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
