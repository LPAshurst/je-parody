import { type PlayClue } from "../../types";
import "../../styles/PlayBoard/PlayClueCell.css";
import ExpandingQuestionModal from "./ExpandingQuestionModal";
import { useState } from "react";

interface ClueCellProps {
    clue: PlayClue;
    handleClick: () => void;
}

export default function ClueCell({ clue, handleClick }: ClueCellProps) {
    const [isOpen, setIsOpen] = useState(false);


    const onClick = () => {
        setIsOpen(true);    
        handleClick();       
    };

    return (
        <>
            {isOpen && (
                <ExpandingQuestionModal
                    onClose={() => setIsOpen(false)}
                    clue={clue}
                />
            )}
            <div className="play-cell" onClick={onClick}>
                <span className="clue-value">${clue.clue_val}</span>     
            </div>
        </>
    );
}