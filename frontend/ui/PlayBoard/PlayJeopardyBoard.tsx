import { type PlayClue } from "../../types";
import "../../styles/PlayBoard/PlayJeopardyBoard.css"
import ClueCell from "./PlayClueCell"

interface JeopardyProps {
    clues: PlayClue[], 
    handleClueClick: (clue: PlayClue) => void;
}

export default function JeopardyBoard({ clues, handleClueClick }: JeopardyProps) {

    const categories = [...new Set(clues.map(clue => clue.category))]
       
    return (
    
            <div className="play-board">
                {categories.map((cat, id) => (
                        <div key={id} className="play-category">
                            <span>{cat}</span>
                        </div>
                ))}

                {   
                    clues.map((clue, index) => (
                        <ClueCell 
                            handleClick={() => handleClueClick(clue)}
                            clue={clue} 
                            key={`${index}-${clue.clue_val}`} 
                        />
                    ))
                }
            </div>
            
    )

}