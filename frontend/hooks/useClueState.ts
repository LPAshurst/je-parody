import { type Clue } from "../types";

export function useClueState(clue: Clue, processedClue: any, processedResponse: any) {
    const hasClue = processedClue.content.trim() !== "";
    const hasResponse = processedResponse.content.trim() !== "";
    
    const hoverable = hasClue || (!hasClue && hasResponse);
    
    let displayText: string | number = processedClue.content;
    let textClass = "";
    
    if (!hasClue && hasResponse) {
        displayText = "Please fill out this clue!";
        textClass = "danger";
    } else if (!hasClue && !hasResponse) {
        displayText = clue.clue_val;
    }
    
    return { 
        hoverable, 
        displayText, 
        textClass
    };
}