import { useEffect, useState } from "react"
// import CrossSiteHeader from "../ui/common/CrossSiteHeader";

import { emptyBoard, type Board, type Clue, type ExternalClue } from "../types/clue";
import JeopardyBoard from "../ui/EditBoard/EditJeopardyBoard";
import { useParams } from "react-router-dom";
import "../styles/EditBoard/BoardToolbar.css"
import useBoardSaveState from "../hooks/useBoardSaveState";
import { useNavigate } from "react-router-dom";

export default function EditBoard() {
    
    const [boardKey, setBoardKey] = useState(0);
    const [boardTitle, setBoardTitle] = useState(""); 
    const navigate = useNavigate();
    const {
        clues,
        modalOpen,
        selectedClue,
        openTextEditor,
        closeTextEditor,
        updateClue,
        setClues,
        saveBoard,
        isSaved, 
        setSaved
    } = useBoardSaveState(emptyBoard(), boardTitle);

    
    const { slug } = useParams();

    useEffect(() => {

        const getBoardData = async () => {

            // const res = await fetch(
            //     `${import.meta.env.VITE_BACKEND_BOARD_API}/request_board/${slug}`, 
            //     { credentials: "include" }
            // )

            const res = await fetch(
                `/api/boards/request_board/${slug}`, 
                { credentials: "include" }
            )
            if (!res.ok) {
                return;
            } else {
                const data: Board = await res.json();
                console.log(data)
                setBoardTitle(data.title)
                setClues(data.clues);
                setBoardKey(prev => prev + 1); // also needed to refresh state
            }
        }
        getBoardData()

    }, [])

    async function getRandomBoard() {
        // const res = await fetch(`${import.meta.env.VITE_BACKEND_BOARD_API}/random_board`);

        const res = await fetch(`/api/boards/random_board`);

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
                clues={clues}
                setClues={setClues}
                modalOpen={modalOpen}
                selectedClue={selectedClue}
                openTextEditor={openTextEditor}
                closeTextEditor={closeTextEditor}
                updateClue={updateClue}
                key={boardKey} 
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
                        onClick={() => saveBoard(clues, boardTitle)} 
                        className="btn-save"
                        disabled={isSaved}
                    >
                        Save Board
                    </button>
                    <button onClick={() => {navigate(`/setup/${slug}`)}}>Play</button>
                </div>
            </div>
        </div>
    )

}