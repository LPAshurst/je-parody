import "../styles/PlayBoard/PlayBoard.css"
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { PlayClue, Game, Player } from "../types";
import JeopardyBoard from "../ui/PlayBoard/PlayJeopardyBoard";
import PlayBoardFooter from "../ui/PlayBoard/PlayBoardFooter"
import { useSocket } from "../context/SocketContext";


export default function PlayBoard() {
    
    const { room } = useParams();
    const [clues, setClues] = useState<PlayClue[]>([]);
    const [currGame, setGame] = useState<Game>();
    const [players, setPlayers] = useState<Record<string, Player>>({});
    const [dailyDouble, setDailyDouble] = useState(false);
    const { socket, rejoinRoom } = useSocket();
    
    function handleClueClick(clue: PlayClue) {
        socket.emit("select-clue", {
            room_id: room,
            position: clue.position
        });
    }

    function handleCloseModal() {
        console.log("here")
        socket.emit("close-clue", room)

    }

    function handleManualPoints(points: number, userName: string) {
        socket.emit("manual-points", {
            room_id: room,
            user_name: userName,
            amount: points
        })
    }

    function answerQuestion(response: boolean) {
        if (dailyDouble) {
            socket.emit("answer_daily_double", {
                room_id: room,
                correct_response: response
            })
        } else {
            socket.emit("board_response", {
                room_id: room,
                correct_response: response
            })
        }

    }

    useEffect(() => {

        if (!room) {
            console.log("No room parameter");
            return;
        }
            
        rejoinRoom(room);
        socket.emit("ask-for-state", room)

        socket.on("get-state", (game: Game) => {
            setGame(game)
            setClues(game.clues)
            console.log(game)
            setPlayers(game.players)
            if (game.current_clue_position) {
                setDailyDouble(game.clues[game.current_clue_position].daily_double)
            }
        })

        return () => {
            socket.off("get-state");
        };
    
    }, [])

    return (
        <>
            <div className="play-area">
                <JeopardyBoard clues={clues} handleClueClick={handleClueClick} isAnswering={currGame ? currGame.buzzer_locked : false} answerQuestion={answerQuestion} handleCloseModal={handleCloseModal}/>
                <PlayBoardFooter players={players} currPlayer={currGame?.active_player} handleManualPoints={handleManualPoints}/>
            </div>
        </>
    )

}