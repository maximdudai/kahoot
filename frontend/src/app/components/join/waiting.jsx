import { LeaveGame } from "../leavegame";

export const WaitingGameStart = () => {
  return (
    <div className="waitingGame">
      <div className="waitingGameTitle">
        <h1 className="text-white text-2xl font-semibold">
          Waiting for game to start...
        </h1>
      </div>

      <LeaveGame />
    </div>
  )
};