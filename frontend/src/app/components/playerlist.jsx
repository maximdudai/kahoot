export const Playerlist = ({ players }) => {
  return (
    <ul className="text-white w-full max-h-80 overflow-y-auto">
      {players.map((player, index) => (
        <li
          className="border-b-2 border-gray-300/20 p-2 mr-1 bg-black/20"
          key={index}
        >
          {player.username}
          <span>
            {player.answer ? " - Answered" : " - Waiting"}
          </span>
        </li>
      ))}
    </ul>
  );
};
