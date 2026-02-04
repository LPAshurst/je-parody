import { useState } from "react";
import "../../styles/PlayBoard/ExpandingQuestionModal.css"
import type { Clue } from "../../types";


interface ExpandingQuestionModalProps {
    onClose: () => void;
    clue: Clue;
}



export default function ExpandingQuestionModal({onClose, clue}: ExpandingQuestionModalProps) {


    const [rect, setRect] = useState<DOMRect>();
    const [isExpanded, setIsExpanded] = useState(false);

    if (!rect) return null;
    return (
        <div className="modal">
            {clue.clue}
        </div>
    );


}