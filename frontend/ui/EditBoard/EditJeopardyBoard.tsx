import { type Clue, emptyBoard } from "../../types";
import "../../styles/EditBoard/EditJeopardyBoard.css"
import ClueCell from "./EditClueCell";
import TextEditorModal from "./TextEditorModal"
import useTextEditor from "../../hooks/useTextEditor";
import {StyledEditCategory} from "../../styles/muiStyled"
import { useState } from "react";

interface JeopardyProps {
    initialClues: Clue[];
    boardTitle: string;              
    setBoardTitle: (title: string) => void; 
    setSaved: (saveState: boolean) => void;
    isSaved: boolean;
}
// FIX ME go through and add logic for if isSave and SetBoardTitle
export default function JeopardyBoard({ initialClues, boardTitle,  setSaved}: JeopardyProps) {

    const cluesToPopulate = initialClues.length != 0 ? initialClues : emptyBoard();

    const {
        clues,
        modalOpen,
        selectedClue,
        openTextEditor,
        closeTextEditor,
        updateClue,
        setClues
    } = useTextEditor(cluesToPopulate, boardTitle);

    const categories = [...new Set(initialClues.map(clue => clue.category))]
       
    const fixedCategories = categories.length > 0 ? categories : Array(6).fill("Enter title here")

    const [displayCategories, setDisplayCategories] = useState(fixedCategories);


    function updateCategory(cat: string, id: number) {
        const newCategories = [...displayCategories];
        newCategories[id] = cat;
        setDisplayCategories(newCategories);

        const updatedClues: Clue[] = clues.map((c, ix) => 
            {
                if (id == ix % clues.length){
                    c.category = cat;
                }
                return c
            }
        );
        setSaved(false)
        setClues(updatedClues)
    }

    return (

        <div className="menu"> 
            <TextEditorModal 
                modalOpen={modalOpen} 
                clue={selectedClue} 
                handleClose={closeTextEditor} 
                onSave={updateClue}
            />
            <div className="edit-board">
                {/* category creation */}
                {
                    displayCategories.map((cat, id) => (
                        <StyledEditCategory
                            key={id}
                            placeholder="Enter category name"
                            value={cat}
                            onChange={(e) => updateCategory(e.target.value, id)}
                            multiline
                            rows={2}
                        />
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
        </div>
    )

}