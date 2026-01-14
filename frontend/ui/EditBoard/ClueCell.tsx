import { type Clue } from "../../types";
import "../../styles/ClueCell.css";
import { useClueState } from "../../hooks/useClueState";
import ProcessClueContent from "../../utils/processClueContent";
import { useMemo } from "react";

interface ClueCellProps {
    clue: Clue;
    onClick: () => void;
}

function MediaOrText({ 
    processedContent, 
    fallbackText, 
    className = "" 
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
        <span className={className}>
            {fallbackText ?? processedContent.content.toString()}
        </span>
    );
}

export default function ClueCell({ clue, onClick }: ClueCellProps) {
    
    const processedClue = useMemo(() => ProcessClueContent(clue.clue), [clue.clue]);
    const processedResponse = useMemo(() => ProcessClueContent(clue.response), [clue.response]);
    
    const { hoverable, displayText, textClass } = useClueState(clue, processedClue, processedResponse);
    
    const hoverClass = hoverable ? "hoverable" : "not-hoverable";

    return (
        <div className={`${hoverClass} cell-wrapping`} onClick={onClick}>
            <div className="cell">
                <div className={`${hoverClass} cell-front`}>
                    <MediaOrText 
                        processedContent={processedClue} 
                        fallbackText={displayText}
                        className={textClass}
                    />
                </div>
                <div className="cell-back">
                    <MediaOrText processedContent={processedResponse} />
                </div>
            </div>
        </div>
    );
}