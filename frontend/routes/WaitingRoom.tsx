import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { UseAuth } from "../context/AuthContext";
import "../styles/WaitingRoom.css";
import { useEffect, useState } from "react";
import type { Game } from "../types";

export default function WaitingRoom() {
    const navigate = useNavigate();
    const auth = UseAuth();
    const { room } = useParams();
    const {socket, rejoinRoom} = useSocket();
    const [players, setPlayers] = useState<string[]>([]);

    const onUserJoined = (userName: string) => {
        console.log(userName)
        setPlayers(prev => [...prev, userName]);
    };
    useEffect(() => {

        if (room) {
            rejoinRoom(room);
        }
        socket.emit("ask-for-state", room)
        socket.on("get-state", (game: Game) => setPlayers([...Object.keys(game.players)]))
        socket.on("user-joined", onUserJoined);
        socket.on("leave-room",  (_str) => {console.log("here"); {navigate("/home")}})

        return () => {
            socket.off("user-joined", onUserJoined);
            socket.off("leave-room")
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
                {players.map((player, index) => (
                <div key={index} className="player-card">
                    <div className="player-avatar">
                    {index}
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