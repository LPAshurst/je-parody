import { type Clue, emptyBoard } from "../../types";
import { useState } from "react";
import "../../styles/JeopardyBoard.css";
import ClueCell from "./ClueCell";
import TextEditorModal from "./TextEditorModal"
import useTextEditor from "../../hooks/useTextEditor";

interface JeopardyProps {
    initialClues: Clue[], 
}

export default function JeopardyBoard({ initialClues }: JeopardyProps) {

    const [boardTitle, setBoardTitle] = useState("Enter title here");
    const cluesToPopulate = initialClues.length != 0 ? initialClues : emptyBoard();

    const {
        clues,
        modalOpen,
        selectedClue,
        openTextEditor,
        closeTextEditor,
        updateClue,
    } = useTextEditor(cluesToPopulate, boardTitle);

    const categories = [...new Set(initialClues.map(clue => clue.category))]
       
    const displayCategories = categories.length > 0 ? categories : Array(6).fill("Enter title here")

    return (

        <div className="menu"> 
            <TextEditorModal 
                modalOpen={modalOpen} 
                clue={selectedClue} 
                handleClose={closeTextEditor} 
                onSave={updateClue}
            />
            <h1 contentEditable>{boardTitle}</h1>
            <div className="board">
                {/* title creation */}
                {
                    displayCategories.map((cat, id) => (
                        <div className="title" key={id} contentEditable>
                            <span>{cat}</span>
                        </div>
                    ))
                }

                {/* Clue cells creation */}
                {   
                    clues.map((clue, index) => (
                        <ClueCell 
                            clue={clue} 
                            key={`${index}-${clue.clue_val}`} 
                            onClick={() => {
                            openTextEditor(clue)
                        }} />
                    ))
                }
            </div>
            <button>Save</button>

        </div>
    )

}