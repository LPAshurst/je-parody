import { createContext, useContext, type ReactNode } from "react";
import { socket, rejoinRoom, getCurrentRoom, leaveRoom } from "../src/socket";
import type { Socket } from "socket.io-client";

interface SocketContextValue {
    socket: Socket;
    rejoinRoom: (roomId: string, userName?: string) => void;
    getCurrentRoom: () => string | null;
    leaveRoom: () => void;
}

const SocketContext = createContext<SocketContextValue | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
    return (
        <SocketContext.Provider value={{ socket, rejoinRoom, getCurrentRoom, leaveRoom }}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    const ctx = useContext(SocketContext);
    if (!ctx) throw new Error("useSocket must be used within a SocketProvider");
    return ctx;
}