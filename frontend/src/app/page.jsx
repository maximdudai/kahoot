'use client'

import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { RiUserReceived2Line } from 'react-icons/ri';
import { MdOutlinePassword } from 'react-icons/md';
import Link from 'next/link';

export default function Home() {
  const [username, setUsername] = useState('');
  const [gameCode, setGameCode] = useState('');
  const socket = useRef(null);

  useEffect(() => {
    // Initialize the socket connection
    socket.current = io('http://192.168.1.180:5050'); // Replace with your server's actual IP address

    socket.current.on('connect', () => {
      console.log('Connected to the server');

      socket.current.on('create-game', (data) => {
        console.log('Received create-game event:', data);
      });

      socket.current.on('player-join', (data) => {
        console.log('Player joined:', data);
      });

      socket.current.on('error', (message) => {
        console.error('Error:', message);
      });

      // Example function to join a game
      const joinGame = (gameCode, username) => {
        const player = { id: generateUniqueId(), username };
        socket.current.emit('join-game', { gameCode, player });
      };

      const generateUniqueId = () => {
        return '_' + Math.random().toString(36).substr(2, 9);
      };
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.current.disconnect();
    };
  }, []);

  const handleJoinGame = () => {
    if (username === '' || gameCode === '') {
      alert('Please fill in all fields.');
      return;
    }

    const player = { id: generateUniqueId(), username };
    socket.current.emit('join-game', { gameCode, player });
  };

  const generateUniqueId = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
  };

  return (
    <div className="bg-gray-800 text-white w-1/3 p-2 flex flex-col gap-3  justify-center rounded-md shadow-lg">
      <div className="authUsername p-2 flex items-center justify-between border-[1px] border-gray-600 rounded-md">
        <input
          className="bg-transparent w-full text-white placeholder:text-white focus:outline-none focus:placeholder:text-gray-400"
          type="text"
          id="username"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <RiUserReceived2Line className="w-10 h-auto p-2 text-black bg-white rounded-md" />
      </div>

      <div className="gameCode p-2 flex items-center justify-between border-[1px] border-gray-600 rounded-md">
        <input
          className="bg-transparent w-full text-white placeholder:text-white focus:outline-none focus:placeholder:text-gray-400"
          type="text"
          id="gameCode"
          placeholder="Code"
          onChange={(e) => setGameCode(e.target.value)}
          required
        />
        <MdOutlinePassword className="w-10 h-auto p-2 text-black bg-white rounded-md" />
      </div>

      <div className="joinGame">
        <button className="bg-green-600 w-full p-2 rounded-md" onClick={handleJoinGame}>
          Join Game
        </button>
      </div>

      <div className="createGame w-full text-center py-2">
        <Link href="/create" className="uppercase text-xs">
          Create Game
        </Link>
      </div>
    </div>
  );
}
