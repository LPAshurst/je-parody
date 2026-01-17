import { useState } from "react"

import "../styles/HomePage.css"
import CrossSiteHeader from "../ui/common/CrossSiteHeader";
import type { Clue, ExternalClue } from "../types/clue";
import JeopardyBoard from "../ui/EditBoard/JeopardyBoard";

export default function EditBoard() {
    
    const [clues, setClues] = useState<Clue[]>([]);
    const [editing, setEditing] = useState<boolean>(true);
    const [boardKey, setBoardKey] = useState(0);

    // function randomInt(min: number, max: number): number {
    // return Math.floor(Math.random() * (max - min + 1)) + min;
    // }    

    async function getRandomBoard() {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_BOARD_API}/random_board`);
        if (!res.ok) {
            return;
        }
        const data = await res.json();

        const externalClues: ExternalClue[] = data.data;
        
        //need to sanitize these clues first because they are coming from external db

        const clues: Clue[] = externalClues.map((clue: ExternalClue, index) => ({
            id: index,  
            clue_val: clue.value,  
            daily_double: false,  
            round: clue.round.startsWith('J') ? 'J!' : 'DJ!', 
            category: clue.category,
            clue: clue.clue,
            response: clue.response,
            clue_is_picture: false,  
            position: index  
        }));


        setClues(clues);
        setBoardKey(prev => prev + 1); // This is used to force the remount of the clues
    }
    
    return (
        <>
            <CrossSiteHeader />
            <div>
                <button onClick={getRandomBoard}>generate me a jeopardy BOARD that people will love</button>
                <button onClick={() => setEditing(!editing)}>do the thing</button>
            </div>
            <JeopardyBoard initialClues={clues} key={boardKey}/>
            
        </>
    )

}