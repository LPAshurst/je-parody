import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Board } from "../types";
import { useSocket } from "../context/SocketContext";
import { UseAuth } from "../context/AuthContext"
import "../styles/HomePage.css";

export default function HomePage() {
    const navigate = useNavigate();
    const [boards, setBoards] = useState<Board[]>([]);
    const [roomCode, setRoomCode] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [showBoards, setShowBoards] = useState(false);
    const {socket} = useSocket();
    const auth = UseAuth();
        
    async function getBoards() {
        setIsLoading(true);
        try {
            // const response = await fetch(
            //     `${import.meta.env.VITE_BACKEND_BOARD_API}/request_user_boards`, 
            //     { credentials: "include" }
            // );
            const response = await fetch(
                `/api/boards/request_user_boards`, 
                { credentials: "include" }
            );
            
            const data: Board[] = await response.json();
            setBoards(data);
            setShowBoards(true);
        } catch (error) {
            console.error("Failed to fetch boards:", error);
        } finally {
            setIsLoading(false);
        }
    }
    
    function handleJoinGame(e: React.FormEvent) {
        e.preventDefault();
        if (roomCode.trim()) {
            socket.emit("join-game", {
                room_id: roomCode.trim().toLowerCase(), 
                user_name: auth.userName
            });
            navigate(`/waiting-room/${roomCode.trim().toLowerCase()}`)
            setRoomCode("");
        }
    }
    
    return (
        <div className="home-container">
            <div className="hero-section">
                <h1 className="title">Je-parody</h1>
                <p className="subtitle">Test your knowledge. Challenge your friends.</p>
            </div>
            
            <div className="main-content">
                <div className="action-cards">
                    <div className="card join-card">
                        <h2>Join a Game</h2>
                        <form onSubmit={handleJoinGame} className="join-form">
                            <input
                                type="text"
                                placeholder="Enter room code"
                                value={roomCode}
                                onChange={(e) => setRoomCode(e.target.value)}
                                className="room-input"
                                maxLength={4}
                            />
                            <button type="submit" className="btn btn-primary" disabled={!roomCode.trim()}>
                                Join Game
                            </button>
                        </form>
                    </div>
                    
                    <div className="card create-card">
                        <h2>Create New Board</h2>
                        <p className="card-description">Design your own Jeopardy board with custom categories</p>
                        <button 
                            onClick={() => navigate("../create")} 
                            className="btn btn-secondary"
                        >
                            Create Board
                        </button>
                    </div>
                </div>
                
                <div className="boards-section">
                    <button 
                        onClick={getBoards} 
                        className="btn btn-outline"
                        disabled={isLoading}
                    >
                        {isLoading ? "Loading..." : showBoards ? "Refresh Boards" : "View My Boards"}
                    </button>
                    
                    {showBoards && boards.length > 0 && (
                        <div className="boards-grid">
                            {boards.map((board) => (
                                <Link
                                    key={board.slug}
                                    to={`/setup/${board.slug}`}
                                    className="board-card"
                                >
                                    <h3>{board.title}</h3>
                                    <span className="board-link">Setup →</span>
                                </Link>
                            ))}
                        </div>
                    )}
                    
                    {showBoards && boards.length === 0 && (
                        <p className="empty-state">No boards yet.&nbsp;
                            <a 
                                style={{ 
                                color: '#60a5fa', 
                                textDecoration: 'underline',
                                cursor: 'pointer' 
                                }} 
                                href="../create">Create 
                            </a>
                            &nbsp;your first one!
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}