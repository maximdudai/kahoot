import { Playerlist } from '@/app/components/playerlist';
import { QuestionAnswer } from '@/app/components/questionanswer';
import { Timer } from '@/app/components/timer';
import { useState } from 'react'

export const CreatorScreen = () => {
  const [timer, setTimer] = useState(30);

  const options = [
    'Yes',
    'No',
    'Maybe',
    'I dont know'
  ];

  const playerList = [
    { username: 'Player 1', score: 0, answer: true },
    { username: 'Player 2', score: 0, answer: false },
    { username: 'Player 3', score: 0, answer: true },
    { username: 'Player 4', score: 0, answer: false },
    { username: 'Player 5', score: 0, answer: true },
    { username: 'Player 6', score: 0, answer: false },
    { username: 'Player 7', score: 0, answer: true },
    { username: 'Player 8', score: 0, answer: false },
    { username: 'Player 9', score: 0, answer: true },
    { username: 'Player 10', score: 0, answer: false },
    { username: 'Player 11', score: 0, answer: true },
    { username: 'Player 12', score: 0, answer: false },
    { username: 'Player 13', score: 0, answer: true },
    { username: 'Player 14', score: 0, answer: false },
    { username: 'Player 15', score: 0, answer: true },
    { username: 'Player 16', score: 0, answer: false },
    { username: 'Player 17', score: 0, answer: true },
    { username: 'Player 18', score: 0, answer: false },
    { username: 'Player 19', score: 0, answer: true },
    { username: 'Player 20', score: 0, answer: false },
  ];

  return (
    <div className="container text-white">

      <div className="gameData w-full flex justify-between items-end">
        <div className="timerCount w-1/4">
          <Timer seconds={timer} />
        </div>

        <div className="creatorAcess w-1/3 flex flex-col gap-2">
          <button className="bg-blue-500 p-2 rounded-md shadow-lg">End Game</button>
          <button className="bg-blue-500 p-2 rounded-md shadow-lg">Increase Timer (+10 sec)</button>
          <button className="bg-blue-500 p-2 rounded-md shadow-lg">Give a hint (removing an option)</button>
          <div className="manageQuestion flex gap-2 justify-between">
            <button className="bg-red-600 w-full p-2 rounded-md shadow-lg">Previous Question</button>
            <button className="bg-red-600 w-full p-2 rounded-md shadow-lg">Next Question</button>
          </div>
        </div>

        <div className="playerList w-1/4">
          <Playerlist players={playerList} />
        </div>
      </div>

      <div className="gameQuestion">
        <QuestionAnswer question={'Is c# a good language?'} options={options} />
      </div>
    </div>
  )
}