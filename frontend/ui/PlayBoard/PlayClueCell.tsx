import { type Clue } from "../../types";
import "../../styles/PlayBoard/PlayClueCell.css";
import ExpandingQuestionModal from "./ExpandingQuestionModal";
import { useState } from "react";

interface ClueCellProps {
    clue: Clue;
}

export default function ClueCell({ clue }: ClueCellProps) {
    const [isOpen, setIsOpen] = useState(false);

    
    return (
        <>
            {isOpen && (
                <ExpandingQuestionModal
                    onClose={() => setIsOpen(false)}
                    clue={clue}
                />
            )}
            <div className="play-cell" onClick={() => setIsOpen(true)}>
                <span className="clue-value">${clue.clue_val}</span>     
            </div>
        </>
    );
}