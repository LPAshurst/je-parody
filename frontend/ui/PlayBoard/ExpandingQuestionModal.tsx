import { useState, useEffect } from "react";
import "../../styles/PlayBoard/ExpandingQuestionModal.css"
import type { PlayClue } from "../../types";

interface ExpandingQuestionModalProps {
    onClose: () => void;
    clue: PlayClue;
    isAnswering: boolean;
    answerQuestion: (response: boolean) => void;
}

export default function ExpandingQuestionModal({onClose, clue, isAnswering, answerQuestion}: ExpandingQuestionModalProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    const getFontSize = (text: string) => {
        const length = text.length;
        if (length > 300) return "clamp(1.5rem, 3vw, 3rem)";
        if (length > 200) return "clamp(2rem, 4vw, 4rem)";
        if (length > 100) return "clamp(2.5rem, 5vw, 5rem)";
        return "clamp(2.5rem, 5vw, 5rem)";
    };
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExpanded(true);
        }, 50);
        
        return () => clearTimeout(timer);
    }, []);
    
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
            if (event.key === "Backspace" && isAnswering) {
                answerQuestion(false)
            }
            
            // doing !showAnswer for when the point is forfeited
            if (event.key === "Enter" && !showAnswer) {
                setShowAnswer(true)
                answerQuestion(true)
            }
        };
        

        window.addEventListener('keydown', handleKeyDown);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    
    return (
        <div 
            className={`modal ${isExpanded ? 'expanded' : ''}`}
        >
            <header className="expanding-modal-header">
                <div className="continue-button">
                    Continue <kbd style={{"marginLeft": ".5rem", "padding": ".05em .6em", "borderRadius": "3px", "lineHeight": "1.4", "fontSize": "larger"}}>ESC</kbd>
                </div>
                <div className="play-header-title">{clue.category} for {clue.clue_val}</div>
                <div className="header-options">
                    <div className="option">
                        Press <kbd>enter</kbd> if the answer is <span style={{"color": "green"}}>correct</span>
                    </div>
                    <div className="option">
                        Press <kbd>backspace</kbd> if the answer is <span style={{"color": "red"}}>wrong</span>
                    </div>
                </div>
            </header>
            <div className="play-modal-content">
                {clue.has_media ? (
                    <div
                        className="play-modal-clue"
                        dangerouslySetInnerHTML={{ __html: clue.clue }}
                    />
                ) : (
                    <div className="play-modal-clue" style={{ fontSize: getFontSize(clue.clue) }}>
                        {clue.clue}
                    </div>
                )}
                <div className="play-modal-response" style={{"visibility": showAnswer ? "visible" : "hidden", fontSize: getFontSize(clue.clue)}}>
                    {clue.response}
                </div>
            </div>
        </div>
    );
}