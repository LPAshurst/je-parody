import { io } from 'socket.io-client';

// not needed when doing dev server
// const URL = import.meta.env.VITE_BACKEND_BASE;

export let socket = io({
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Store current room and user info for reconnection
let currentRoom: string | null = null;
let currentUserName: string | null = null;

// Helper function to join a room
export function rejoinRoom(roomId: string, userName?: string) {
  currentRoom = roomId;
  if (userName) {
    currentUserName = userName;
  }
  
  
  socket.emit('rejoin-room', currentRoom)
}

// Helper to get current room
export function getCurrentRoom() {
  return currentRoom;
}

// Helper to leave room
export function leaveRoom() {
  currentRoom = null;
  currentUserName = null;
}

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);
});

socket.on("reconnect", (attemptNumber) => {
  console.log("Socket reconnected after", attemptNumber, "attempts");
});

socket.on("reconnect_error", (error) => {
  console.error("Reconnection error:", error);
});

socket.on("reconnect_failed", () => {
  console.error("Reconnection failed after all attempts");
});