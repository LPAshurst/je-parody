import { type PlayClue } from "../../types";
import "../../styles/PlayBoard/PlayClueCell.css";
import ExpandingQuestionModal from "./ExpandingQuestionModal";
import { useState } from "react";

interface ClueCellProps {
    clue: PlayClue;
    handleClick: () => void;
    isAnswering: boolean;
    answerQuestion: (response: boolean) => void;
    handleCloseModal: () => void;
}

export default function ClueCell({ clue, handleClick, isAnswering, answerQuestion, handleCloseModal }: ClueCellProps) {
    const [isOpen, setIsOpen] = useState(false);

    const onClick = () => {
        setIsOpen(true);    
        handleClick();       
    };

    return (
        <>
            {isOpen && (
                <ExpandingQuestionModal
                    answerQuestion={answerQuestion}
                    isAnswering={isAnswering}
                    onClose={() => {
                        setIsOpen(false)
                        handleCloseModal()
                    }}
                    clue={clue}
                />
            )}
            <div className={clue.answered ? "answered-cell" : "play-cell"} onClick={onClick}>
                {clue.answered ? <></> : <span className="clue-value">${clue.clue_val}</span>}  
            </div>
        </>
    );
}