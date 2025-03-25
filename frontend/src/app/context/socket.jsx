"use client";

import { createContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";
import {
    handleCancelGame,
    onPlayerJoinGame,
    onPlayerLeaveGame,
} from "@/app/utils/socket";


export const SocketContext = createContext();

export default function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const router = useRouter();
    const [isCreator, setIsCreator] = useState(false);
    const socketRef = useRef(null);

    // Initialize socket only once
    useEffect(() => {
        if (!socketRef.current) {
            const newSocket = io(process.env.SOCKET_URL);
            socketRef.current = newSocket;
            setSocket(newSocket);

            // Cleanup on unmount
            return () => {
                newSocket.disconnect();
            };
        }
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on("client-cancel-game", handleCancelGame);
        socket.on("player-join", onPlayerJoinGame);
        socket.on("player-left", onPlayerLeaveGame);

        // Cleanup event listeners
        return () => {
            socket.off("client-cancel-game", handleCancelGame);
            socket.off("player-join", onPlayerJoinGame);
            socket.off("player-left", onPlayerLeaveGame);
        };
    }, [socket, router]);

    if (!socket) {
        return null;
    }

    return (
        <SocketContext.Provider value={{ socket, isCreator, setIsCreator }}>
            {children}
        </SocketContext.Provider>
    );
}