import "../styles/PlayBoard/PlayBoard.css"
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { PlayClue, Game, Player, StateResponse } from "../types";
import JeparodyBoard from "../ui/PlayBoard/PlayJeparodyBoard";
import PlayBoardFooter from "../ui/PlayBoard/PlayBoardFooter"
import { useSocket } from "../context/SocketContext";


export default function PlayBoard() {
    
    const { room } = useParams();
    const [clues, setClues] = useState<PlayClue[]>([]);
    const [currGame, setGame] = useState<Game>();
    const [players, setPlayers] = useState<Record<string, Player>>({});
    const [dailyDouble, setDailyDouble] = useState(false);
    const { socket, rejoinRoom } = useSocket();
    const navigate = useNavigate();
    
    function handleClueClick(clue: PlayClue) {
        socket.emit("select-clue", {
            room_id: room,
            position: clue.position,
            daily_double: clue.daily_double
        });
    }

    function handleCloseModal() {
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
            socket.emit("answer-daily-double", {
                room_id: room,
                correct_response: response
            })
        } else {
            socket.emit("board-response", {
                room_id: room,
                correct_response: response
            })
        }
    }

    useEffect(() => {

        if (!room) {
            return;
        }
            
        rejoinRoom(room);
        socket.emit("ask-for-state", room)

        socket.on("get-state", (response: StateResponse) => {
            if (response.game !== null) {
                const game = response.game;
                setGame(game)
                setClues(game.clues)
                setPlayers(game.players)
                if (game.current_clue_position !== null) {
                    setDailyDouble(game.clues[game.current_clue_position].daily_double)
                }
            } else {
                navigate("/home")
            }

        })

        socket.on("finished-game", (game: Game) => {
            navigate("/game-over", {
                state: {
                    game,
                    players: game.players
                }
            });
        })

        return () => {
            socket.off("get-state");
            socket.off("finished-game");
        };
    
    }, [])

    return (
        <>
            <div className="play-area">
                <JeparodyBoard clues={clues} handleClueClick={handleClueClick} isAnswering={currGame ? currGame.buzzer_locked : false} answerQuestion={answerQuestion} handleCloseModal={handleCloseModal}/>
                <PlayBoardFooter players={players} currPlayer={currGame?.active_player} handleManualPoints={handleManualPoints}/>
            </div>
        </>
    )

}