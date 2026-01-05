import { type Clue } from "../types";
import { useState } from "react";
import "../styles/JeopardyBoard.css";


interface JeopardyProps {
    clues: Clue[], 
    editing: boolean
}

export default function JeopardyBoard({ clues, editing }: JeopardyProps) {

    const categorySet = new Set(clues.map(clue => clue.category));
    
    return (

        <>

            <div className="board">
                {
                    [...categorySet].map((cat, id) => (
                        <div className="title" key={id}>
                            {cat}
                        </div>
                    ))
                }
                {   
                    clues.map((clue, i) => (
                        <div key={i} className={editing + "-cell"}>
                            
                            {/* dispaly the clue if we are editing and the value otherwise */}
                            {editing ? clue.clue : "$" + clue.value}

                        </div>
                    ))
                }

            </div>

        </>




    )









}