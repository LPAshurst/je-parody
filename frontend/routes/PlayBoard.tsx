import "../styles/PlayBoard/PlayBoard.css"
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { PlayClue, Game, Player } from "../types";
import JeopardyBoard from "../ui/PlayBoard/PlayJeopardyBoard";
import PlayBoardFooter from "../ui/PlayBoard/PlayBoardFooter"
import { socket, rejoinRoom } from "../src/socket";

export default function PlayBoard() {
    
    const { room } = useParams();
    console.log(room)
    const [clues, setClues] = useState<PlayClue[]>([]);
    const [players, setPlayers] = useState<Record<string, Player>>({});

    function handleClueClick(clue: PlayClue) {
        socket.emit("select-clue", {
            room_id: room,
            position: clue.position
        });
    }

    useEffect(() => {

        if (!room) {
            console.log("No room parameter");
            return;
        }
            
        rejoinRoom(room);

        socket.emit("ask-for-state", room)

        socket.on("get-state", (game: Game) => {
            console.log(game)
            setClues(game.clues)
            setPlayers(game.players)
        })

        return () => {
            socket.off("get-state");
        };
    
    }, [])

    return (
        <>
            <div className="play-area">
                <JeopardyBoard clues={clues} handleClueClick={handleClueClick} />
                <PlayBoardFooter players={players}/>
            </div>
        </>
    )

}