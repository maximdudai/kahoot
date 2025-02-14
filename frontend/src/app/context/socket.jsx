"use client";

import { createContext, useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";
import { isGameCreator } from "../utils/player";
import { useBeforeUnload } from "react-router-dom";

export const SocketContext = createContext(null);

export default function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const newSocket = io(process.env.SOCKET_URL);
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    // auto join game if user has valid game data in local storage
    // confirmar se este codigo não é executado duma forma que não devia ??!?!?!
    useEffect(() => {
        // get data if user joined as a creator
        const localGameData = JSON.parse(localStorage.getItem("game"));
        // get data if user joined as a player
        const username = localStorage.getItem("username") ?? 'creator';
        const gameCode = localGameData?.gameSettings?.gameCode;

        if (!localGameData) {
            return;
        }
        if(!gameCode && !localGameData) {
            return;
        }
        if(!username && !localGameData) {
            return;
        }

        if (socket === null)
            return;

        socket?.emit("join-game", { gameCode, username }, (response) => {
            if (response?.success === false) {
                return;
            }

            localStorage.setItem("username", username);
            localStorage.setItem("socket", socket.id);
            localStorage.setItem("game", JSON.stringify(response?.gameData));

            if (response?.inQueue) {
                router.push("/queue", undefined, { shallow: true });
                return;
            }
            router.push("/waiting", undefined, { shallow: true });
        });
    }, [socket]);

    useEffect(() => {
        const handleCancelGame = () => {
            alert("Game has been canceled, redirecting to the home page.");

            // Clear the local storage
            localStorage.removeItem("game");
            localStorage.removeItem("username");
            localStorage.removeItem("socket");

            // Redirect to the home page
            router.push("/");
        };

        const handleJoinGame = (player) => {
            let localGameData = JSON.parse(localStorage.getItem("game"));

            if (!localGameData || !localGameData.players) {
                console.error("No game data found or players array is missing.");
                return;
            }

            localGameData.players.push(player);
            localStorage.setItem("game", JSON.stringify(localGameData));
            
            // Dispatch event to notify about the update
            const event = new Event("updateGamePlayers");
            window.dispatchEvent(event);
        };

        const handlePlayerLeft = (playerData) => {
            let localGameData = JSON.parse(localStorage.getItem("game"));

            if (!localGameData || !localGameData.players) {
                console.error("No game data found or players array is missing.");
                return;
            }

            // Filter out the player who left
            const updatedPlayers = localGameData.players.filter(
                (player) => player.socket !== playerData.socket
            );
            localGameData = { ...localGameData, players: updatedPlayers };

            // Update localStorage with the player removed
            localStorage.setItem("game", JSON.stringify(localGameData));

            // Dispatch event to notify about the update
            const event = new Event("updateGamePlayers");
            window.dispatchEvent(event);
        };

        socket?.on("client-cancel-game", handleCancelGame);
        socket?.on("player-join", handleJoinGame);
        socket?.on("player-left", handlePlayerLeft);

        return () => {
            socket?.off("client-cancel-game", handleCancelGame);
            socket?.off("player-join", handleJoinGame);
            socket?.off("player-left", handlePlayerLeft);
        };
    }, [socket]);

    useBeforeUnload(
        useCallback(() => {
            const isCreator = isGameCreator(socket?.id);
            if (!isCreator) return;

            // socket?.emit("server-cancel-game");
        }, [socket])
    );

    if (!socket) {
        return null; // Or a loading spinner or placeholder
    }

    return (
        <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
    );
}
