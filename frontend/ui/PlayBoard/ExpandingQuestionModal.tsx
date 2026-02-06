import { useState, useEffect } from "react";
import "../../styles/PlayBoard/ExpandingQuestionModal.css"
import type { PlayClue } from "../../types";

interface ExpandingQuestionModalProps {
    onClose: () => void;
    clue: PlayClue;
}

export default function ExpandingQuestionModal({onClose, clue}: ExpandingQuestionModalProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    
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
                <div className="header-spacer"/>
                <div className="header-title">{clue.category} for {clue.clue_val}</div>
                <div className="header-options">ryan</div>
            </header>
            <div className="play-modal-content">
                <span>{clue.clue}</span>
            </div>
        </div>
    );
}