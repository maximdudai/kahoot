import React, { useState, useEffect, useContext } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { SocketContext } from "../context/socket";


export const Playerlist = ({ playerList }) => {

  return (
    <ul className="flex justify-center flex-wrap w-full gap-2 text-white max-h-80"
      style={{
        overflowY: "auto",
        scrollbarColor: "rgba(255, 255, 255, 0.5) rgba(0, 0, 0, 0.5)",
      }}
    >
      {playerList?.map((player, index) => (
        <li
          className={`flex flex-col justify-center items-center gap-1 min-w-12 ${player.answer ? 'border-2 border-green-500' : 'border-[1px] border-gray-300'} rounded-lg p-2`}
          style={{
            wordBreak: "break-all",
          }}
          key={index}
        >
          <FaRegUserCircle className="text-2xl" />
          <span>{player.username}</span>
          {/* {player.username}
          {player.asnwered && (
            <span>{player.answer ? " - Answered" : " - Waiting"}</span>
          )} */}
        </li>
      ))}
    </ul>
  );
};
