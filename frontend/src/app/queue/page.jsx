import { LeaveGame } from "../components/leavegame";
import { Kahoot } from "../components/title";

export default function GameQueue() {
return (
    <div className="container flex flex-col items-center text-center">
      <Kahoot />

      <div className="bg-white/10 w-1/3 text-white text-xl shadow-lg shadow-black rounded-md py-5">
        <p>You are in queue</p>
        <p>There is an active question, please wait!</p>
      </div>

      <LeaveGame className={'mt-5'} />
    </div>
  )
};