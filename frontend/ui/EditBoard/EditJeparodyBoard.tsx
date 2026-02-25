import { type Clue } from "../../types";
import "../../styles/EditBoard/EditJeparodyBoard.css"
import ClueCell from "./EditClueCell";
import TextEditorModal from "./TextEditorModal"
import {StyledEditCategory} from "../../styles/muiStyled"
import { useState } from "react";

interface JeparodyBoardProps {
    clues: Clue[];
    setClues: (clues: Clue[]) => void;
    modalOpen: boolean;
    selectedClue: Clue | null;
    openTextEditor: (clue: Clue) => void;
    closeTextEditor: () => void;
    updateClue: (clue: Clue) => void;
    setSaved: (saveState: boolean) => void;
}

// FIX ME go through and add logic for if isSave and SetBoardTitle
export default function JeparodyBoard({ 
    clues, 
    setClues,
    modalOpen,
    selectedClue,
    openTextEditor,
    closeTextEditor,
    updateClue,
    setSaved
}: JeparodyBoardProps) {


    const initialCategories = Array.from({ length: 6 }, (_, col) =>
        clues[col]?.category ?? ""
    );

    const [displayCategories, setDisplayCategories] = useState(initialCategories);


    function updateCategory(cat: string, col: number) {
        const newCategories = [...displayCategories];
        newCategories[col] = cat;
        setDisplayCategories(newCategories);

        const updatedClues: Clue[] = clues.map((c, ix) => 
            {
                if (col == ix % 6){
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