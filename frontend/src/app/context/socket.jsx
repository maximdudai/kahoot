'use client'

import { createContext, useEffect, useState } from "react";
import { io } from 'socket.io-client';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://192.168.1.200:5050'); // Initialize the socket connection
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  if (!socket) {
    return null; // Or a loading spinner or placeholder
  }

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
