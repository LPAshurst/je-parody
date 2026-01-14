import { useState } from "react"

import "../styles/HomePage.css"
import CrossSiteHeader from "../ui/common/CrossSiteHeader";
import type { Clue } from "../types/clue";
import JeopardyBoard from "../ui/EditBoard/JeopardyBoard";

export default function EditBoard() {
    
    const [_, setClue] = useState<Clue>();
    const [clues, setClues] = useState<Clue[]>([]);
    const [editing, setEditing] = useState<boolean>(true);
    const [boardKey, setBoardKey] = useState(0);

    function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
    }    

    async function getRandomClue() {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_CLUE_API}/random_question`);
        const data = await res.json();
        const n = randomInt(1, 49);
        setClue(data.data[n])
    }

    async function getRandomBoard() {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_CLUE_API}/random_board`);
        if (!res.ok) {
            return;
        }
        const data = await res.json();
        setClues(data.data);
        setBoardKey(prev => prev + 1); // Force remount

    }
    
    return (
        <>
            <CrossSiteHeader />
            <div>
                <button onClick={getRandomClue}>generate me a jeopardy CLUE that  people will love</button>
                <button onClick={getRandomBoard}>generate me a jeopardy BOARD that people will love</button>
                <button onClick={() => setEditing(!editing)}>do the thing</button>
            </div>
            <JeopardyBoard initialClues={clues} key={boardKey}/>
            
        </>
    )

}