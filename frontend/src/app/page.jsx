"use client";

import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { RiUserReceived2Line } from "react-icons/ri";
import { MdOutlinePassword } from "react-icons/md";
import { SocketContext } from "./context/socket";
import { Kahoot } from "./components/title";

export default function Home() {
  const [username, setUsername] = useState("");
  const [gameCode, setGameCode] = useState("");
  const router = useRouter();

  const socket = useContext(SocketContext);

  const handleJoinGame = () => {
    try {
      if (username === "" || gameCode === "") {
        alert("Please fill in all fields.");
        return;
      }

      socket?.emit("join-game", { gameCode, username }, (response) => {
        if (response?.success == false) {
          alert("Game not found");
          return;
        }

        localStorage.setItem("username", username);
        localStorage.setItem("socket", socket.id);
        localStorage.setItem("game", JSON.stringify(response?.gameData));

        router.push("/waiting", undefined, { shallow: true });
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="text-black w-full md:w-1/2 lg:w-1/3 p-2 flex flex-col gap-3  justify-center rounded-md">
      <Kahoot />
      <div className="authUsername font-bold text-xl p-2 flex items-center justify-between border-8 border-green-500 rounded-full">
        <input
          className="bg-transparent w-full text-white placeholder:text-white px-2 focus:outline-none focus:placeholder:text-gray-400"
          type="text"
          id="username"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          maxLength="15"
          required
        />
        <RiUserReceived2Line className="w-10 h-full text-green-500" />
      </div>

      <div className="gameCode font-bold text-xl p-2 flex items-center justify-between border-8 border-green-500 rounded-full">
        <input
          className="bg-transparent w-full text-white placeholder:text-white px-2 focus:outline-none focus:placeholder:text-gray-400"
          type="text"
          id="gameCode"
          placeholder="Code"
          onChange={(e) => setGameCode(e.target.value)}
          required
        />
        <MdOutlinePassword className="w-10 h-full text-green-500" />
      </div>

      <div className="gameButtons flex flex-col md:flex-row justify-center gap-4 cursor-pointer">
        <button
          className="bg-emerald-500 w-full md:w-1/3 uppercase tracking-widest font-bold text-white p-2 rounded-md hover:scale-110 transform transition-all"
          onClick={handleJoinGame}
        >
          Join
        </button>
        <Link
          href="/create"
          className="w-full md:w-1/3 text-center uppercase tracking-widest p-2 rounded-md text-green-500 hover:bg-emerald-500 hover:text-white hover:scale-110 transform transition-all "
        >
          <span className="font-bold">Create Game</span>
        </Link>
      </div>
    </div>
  );
}
