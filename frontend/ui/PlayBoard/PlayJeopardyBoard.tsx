import { type Clue } from "../../types";
import "../../styles/PlayBoard/PlayJeopardyBoard.css"
import ClueCell from "./PlayClueCell"

interface JeopardyProps {
    clues: Clue[], 
}

export default function JeopardyBoard({ clues }: JeopardyProps) {

    const categories = [...new Set(clues.map(clue => clue.category))]
       
    return (
    
        // need to make a menu here where the user can decide to create a room or do local
            <div className="play-board">
                {
                    categories.map((cat, id) => (
                        <div key={id} className="play-category">
                            <span>{cat}</span>
                        </div>
                    ))
                }

                {   
                    clues.map((clue, index) => (
                        <ClueCell 
                            clue={clue} 
                            key={`${index}-${clue.clue_val}`} 
                        />
                    ))
                }
            </div>
            
    )

}