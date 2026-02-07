import { useParams } from "react-router-dom";
import "../styles/Buzzer.css"
import { useEffect, useState } from "react";
import { rejoinRoom, socket } from "../src/socket";
import type { Game } from "../types";
import { UseAuth } from "../context/AuthContext";

export default function Buzzer() {

    const { room } = useParams();
    const [buzzerLocked, setBuzzerLocked] = useState(true);
    const auth = UseAuth();

    function buzz() {
        socket.emit("buzz_in", {room_id: room, user_name: auth.userName})
    }

    useEffect(() => {

        if (room) {
            rejoinRoom(room);
        }

        socket.on("get-state", (game: Game) => {
            setBuzzerLocked(game.buzzer_locked)
        })

    }, [])

    return (
    <div className="buzzer-container">
        <button 
        className={`buzzer-button ${buzzerLocked ? "disabled" : ""}`}
        onClick={buzz}
        disabled={buzzerLocked}
        >
        BUZZ
        </button>
    </div>
    );
}