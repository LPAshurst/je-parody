import { useEffect, useState } from "react"
// import CrossSiteHeader from "../ui/common/CrossSiteHeader";

import type { Board, Clue, ExternalClue } from "../types/clue";
import JeopardyBoard from "../ui/EditBoard/EditJeopardyBoard";
import { useParams } from "react-router-dom";
import "../styles/EditBoard/BoardToolbar.css"

export default function EditBoard() {
    
    const [clues, setClues] = useState<Clue[]>([]);
    const [boardKey, setBoardKey] = useState(0);
    const [boardTitle, setBoardTitle] = useState(""); 
    const [isSaved, setSaved] = useState(true);

    const { slug } = useParams();

    useEffect(() => {

        const getBoardData = async () => {

            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_BOARD_API}/request_board/${slug}`, 
                { credentials: "include" }
            )
            if (!res.ok) {
                return;
            } else {
                const data: Board = await res.json();
                setBoardTitle(data.title)
                setClues(data.clues);
                setBoardKey(prev => prev + 1); // also needed to refresh state
            }

        }

        getBoardData()

    }, [])

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
        setSaved(false);
    }
    
    return (
        <div className="edit-page">
            <input 
                className="title" 
                type="text"
                value={boardTitle}
                onChange={e => {setSaved(false); setBoardTitle(e.target.value)}} 
                placeholder={"Enter title here"} 
            />
            <JeopardyBoard 
                boardTitle={boardTitle} 
                setBoardTitle={setBoardTitle} 
                initialClues={clues} 
                key={boardKey} 
                isSaved={isSaved} 
                setSaved={setSaved}
            />

             {/* Board Toolbar */}
            <div className="board-toolbar">
                <button 
                    onClick={getRandomBoard}
                    className="btn-generate"
                >
                    Generate Random Board
                </button>
                
                <div className="toolbar-right">
                    <div className={`save-status ${isSaved ? 'saved' : 'unsaved'}`}>
                        {isSaved ? '✅ Saved' : '● Unsaved changes'}
                    </div>
                    <button 
                        onClick={() => {}} // need to update so we can actually save the full board when changing things
                        className="btn-save"
                        disabled={isSaved}
                    >
                        Save Board
                    </button>
                </div>
            </div>
        </div>
    )

}