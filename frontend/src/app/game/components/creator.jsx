import { useState, useContext, useEffect } from 'react';

import { Playerlist } from '@/app/components/playerlist';
import { QuestionAnswer } from '@/app/components/questionanswer';
import { Timer } from '@/app/components/timer';
import { SocketContext } from '@/app/context/socket';

export const CreatorScreen = ({ question, options }) => {
  const [playerList, setPlayerList] = useState([]);
  const socket = useContext(SocketContext);


  useEffect(() => {
    socket?.on('player-answered', (data) => {
      const findPlayer = playerList.find(player => player.socket === data.socket);
      if (findPlayer) {
        findPlayer.answered = true;
        setPlayerList([...playerList]);
      }
    })

    return () => {
      socket?.off('player-answered');
    }

  }, [])

  return (
    <div className="container text-white">

      <div className="gameData w-full flex justify-between items-end">
        <div className="timerCount w-1/4">
          <Timer />
        </div>

        <div className="creatorAcess w-1/3 flex flex-col gap-2">
          <button className="bg-blue-500 p-2 rounded-md shadow-lg hover:bg-blue-500/80">End Game</button>
          <button className="bg-blue-500 p-2 rounded-md shadow-lg hover:bg-blue-500/80">Increase Timer (+10 sec)</button>
          <button className="bg-blue-500 p-2 rounded-md shadow-lg hover:bg-blue-500/80">Give a hint (removing an option)</button>
          <div className="manageQuestion flex gap-2 justify-between">
            <button className="bg-red-600/60 w-full p-2 rounded-md shadow-lg hover:bg-red-600">Previous Question</button>
            <button className="bg-red-600/60 w-full p-2 rounded-md shadow-lg hover:bg-red-600">Next Question</button>
          </div>
        </div>

        <div className="playerList w-1/4">
          <Playerlist players={playerList} playing />
        </div>
      </div>

      <div className="gameQuestion">
        <QuestionAnswer question={question} options={options} disabled />
      </div>
    </div>
  )
}