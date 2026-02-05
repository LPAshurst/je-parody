import "../styles/PlayBoard/PlayBoard.css"
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Board, Clue } from "../types";
import JeopardyBoard from "../ui/PlayBoard/PlayJeopardyBoard";
import PlayBoardFooter from "../ui/PlayBoard/PlayBoardFooter"

export default function PlayBoard() {

    const { slug } = useParams();

    const [clues, setClues] = useState<Clue[]>([]);
    

    useEffect(() => {

        const getBoardData = async () => {

            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_BOARD_API}/request_board/${slug}`, 
                { credentials: "include" }
            )
            if (!res.ok) {
                console.log("didnt work :(")
                console.log(res.statusText)
                return;
            } else {
                const data: Board = await res.json();

                setClues(data.clues);
            }

        }

        getBoardData()

    }, [])

    return (
        <div className="play-area">
            <JeopardyBoard clues={clues} />
            <PlayBoardFooter></PlayBoardFooter>
        </div>
    )

}