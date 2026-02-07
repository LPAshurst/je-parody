import { useNavigate, useParams } from "react-router-dom";
import { socket, rejoinRoom } from "../src/socket";
import { UseAuth } from "../context/AuthContext";
import "../styles/WaitingRoom.css";
import { useEffect, useState } from "react";
import type { Game, Player } from "../types";

export default function WaitingRoom() {
    const navigate = useNavigate();
    const auth = UseAuth();
    const { room } = useParams();
    const [players, setPlayers] = useState<Record<string, Player>>({});

    useEffect(() => {

        if (room) {
            rejoinRoom(room);
        }

        socket.on("get-state", (game: Game) => {
            setPlayers(game.players)
        })

        return () => {
            socket.off("get-state")
        }

    }, [])


    useEffect(() => {
        socket.on("navigate-to-start", (room_id: string) => {
            navigate(`/player/${room_id}`)
        })
        
        return () => {
            socket.off("navigate-to-start");
        }
    }, [navigate])

    function handleLeave() {
        socket.emit("leave-game", { room_id: room, user_name: auth.userName });
        navigate("/");
    }

    return (
    <div className="waiting-room-container">
        <div className="waiting-room-card">
        <div className="room-header">
            <div className="room-code-section">
            <span className="room-code-label">Room Code</span>
            <div className="room-code">{room?.toUpperCase()}</div>
            </div>
            
            <button onClick={handleLeave} className="leave-btn">
            Leave Room
            </button>
        </div>

        <div className="waiting-content">
            <h1 className="waiting-title">Waiting for Host to Start...</h1>
            
            <div className="players-section">
            <div className="players-header">
                <span className="players-count">{Object.keys(players).length} {Object.keys(players).length === 1 ? 'Player' : 'Players'}</span>
            </div>
            
            <div className="players-grid">
                {Object.keys(players).map((player, index) => (
                <div key={index} className="player-card">
                    <div className="player-avatar">
                    {player.charAt(0).toUpperCase()}
                    </div>
                    <div className="player-info">
                    <span className="player-name">{player}</span>
                    </div>
                </div>
                ))}
            </div>
            </div>

            <div className="waiting-animation">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            </div>
        </div>
        </div>
    </div>
    );
    }