import { useParams } from "react-router-dom";
import "../styles/Buzzer.css"
import { useEffect, useState } from "react";
import { rejoinRoom, socket } from "../src/socket";
import type { Game } from "../types";
import { UseAuth } from "../context/AuthContext";

export default function Buzzer() {

    const { room } = useParams();
    const [buzzerLocked, setBuzzerLocked] = useState(true);
    const [hasAnswered, setHasAnswered] = useState(false);
    const auth = UseAuth();

    function buzz() {
        socket.emit("buzz_in", {room_id: room, user_name: auth.userName})
    }

    useEffect(() => {

        if (room) {
            rejoinRoom(room);
            socket.emit("ask-for-state", room);
        }

        socket.on("get-state", (game: Game) => {
            setBuzzerLocked(game.buzzer_locked)
            setHasAnswered(game.players[auth.userName].has_answered)
        })


        return () => {
            socket.off("get-state")
        }

    }, [])

    return (
    <div className="buzzer-container">
        <button 
        className={`buzzer-button ${hasAnswered || buzzerLocked ? "disabled" : ""}`}
        onClick={buzz}
        disabled={hasAnswered || buzzerLocked}
        >
        BUZZ
        </button>
    </div>
    );
}