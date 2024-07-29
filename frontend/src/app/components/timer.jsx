import { MdOutlineTimer } from "react-icons/md";

export const Timer = ({ seconds }) => {
  return (
    <div className="timerInformation shadow-lg shadow-black/30 border-l-[1px] border-r-[1px] border-gray-300/30 w-32 uppercase flex flex-col justify-center items-center">
      <div className="timeLeft w-full bg-white/30">
        <MdOutlineTimer className="w-10 m-auto h-auto p-2 rounded-md" />
      </div>
      <p className="text-8xl font-bold">{seconds}</p>
      <p className="text-2xl w-32 bg-white/30 text-center text-white">
        seconds
      </p>
    </div>
  );
};
