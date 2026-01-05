import { type Clue } from "../types";
import "../styles/JeopardyBoard.css";


interface JeopardyProps {
    clues: Clue[], 
    editing: boolean
}

export default function JeopardyBoard({ clues, editing }: JeopardyProps) {

    const categorySet = new Set(clues.map(clue => clue.category));
    console.log(clues)
    return (

        <>

            <div className="board">
                {
                    [...categorySet].map((cat, id) => (
                        <div className="title" key={id} contentEditable={editing}>
                            {cat}
                        </div>
                    ))
                }
                {   
                    
                    clues.map((clue, i) => (
                        <div key={i} className={editing + "-cell"}>
                            <span>{editing ? clue.clue : "$" + clue.value}</span>
                        </div>
                    ))
                }

            </div>

        </>




    )









}