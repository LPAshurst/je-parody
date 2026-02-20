import { useParams } from "react-router-dom";
import "../styles/Buzzer.css"
import Wager from "../ui/Buzzer/Wager";
import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import type { Game, PlayClue } from "../types";
import { UseAuth } from "../context/AuthContext";

export default function Buzzer() {

    const { room } = useParams();
    const [buzzerLocked, setBuzzerLocked] = useState(true);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [playerScore, setPlayerScore] = useState(0);
    const [answeringDailyDouble, setAnsweringDailyDouble] = useState(false);


    const {socket, rejoinRoom} = useSocket();

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
            const player = game.players[auth.userName]
            setBuzzerLocked(game.buzzer_locked)
            setHasAnswered(player.has_answered)
            setPlayerScore(player.score)
            if (game.current_clue_position) {
                const clue: PlayClue = game.clues[game.current_clue_position]
                setAnsweringDailyDouble(clue.daily_double && auth.userName === game.player_picking_category && player.wagered === false && !clue.answered)
            }
        })


        return () => {
            socket.off("get-state")
        }

    }, [])

    if (answeringDailyDouble) {
        return (
            <div className="buzzer-container">
                <Wager
                    room={room!}
                    userName={auth.userName}
                    playerScore={playerScore}
                    onWagerSubmitted={() => setAnsweringDailyDouble(false)}
                    socket={socket}
                />
            </div>
        );
    }

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