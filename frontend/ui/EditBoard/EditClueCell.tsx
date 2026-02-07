import { type Clue } from "../../types";
import "../../styles/EditBoard/EditClueCell.css";
import { useClueState } from "../../hooks/useClueState";
import processClueContent from "../../utils/processClueContent";
import { useMemo } from "react";

interface ClueCellProps {
    clue: Clue;
    onClick: () => void;
}

function MediaOrText({ 
    processedContent, 
    fallbackText, 
}: { 
    processedContent: 
    {
        hasMedia: boolean;
        content: string;
    }
    fallbackText?: string | number;
    className?: string;
}) {
    if (processedContent.hasMedia) {
        return (
            <div
                className="media-content" 
                dangerouslySetInnerHTML={{ __html: processedContent.content }} 
            />
        );
    }
    return (
        <span className="text-content">
            {fallbackText ?? processedContent.content.toString()}
        </span>
    );
}

export default function ClueCell({ clue, onClick }: ClueCellProps) {
    
    const processedClue = useMemo(() => processClueContent(clue.clue), [clue.clue]);
    const processedResponse = useMemo(() => processClueContent(clue.response), [clue.response]);
    
    const { hoverable, displayText } = useClueState(clue, processedClue, processedResponse);
    
    const hoverClass = hoverable ? "hoverable" : "not-hoverable";

    return (
        <div className={`${hoverClass} cell-wrapping`} onClick={onClick}>
            <div className="edit-cell">
                <div className={`${hoverClass} cell-front`}>
                    <MediaOrText 
                        processedContent={processedClue} 
                        fallbackText={displayText}
                    />
                </div>
                <div className="cell-back">
                    <MediaOrText processedContent={processedResponse} />
                </div>
            </div>
        </div>
    );
}