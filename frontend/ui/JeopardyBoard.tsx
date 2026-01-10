import { type Clue, emptyBoard, emptyClue } from "../types";
import "../styles/JeopardyBoard.css";
import { Modal } from "@mui/material";
import { useState } from "react";
import WYSIWYG from "./WYSIWYG";

interface JeopardyProps {
    clues: Clue[], 
    editing: boolean
}

export default function JeopardyBoard({ clues, editing }: JeopardyProps) {

    const categorySet = new Set(clues.map(clue => clue.category));
    
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedClue, setSelectedClue] = useState<Clue | null>(null);
    
    const handleOpen = () => setModalOpen(true);
    const handleClose = () =>  {
        setModalOpen(false);
        setSelectedClue(null);
    }

    const cluesToPopulate = clues.length != 0 ? clues : emptyBoard();


    return (

        <div className="menu">
            <Modal 
                open={modalOpen}
                onClose={(_, reason) => {
                    if (reason !== 'backdropClick') {
                    handleClose();
                    }
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="editing-modal">
                    <header className="modal-header"/>
                    <WYSIWYG selectedClue={selectedClue}/>
                </div>
            </Modal>
            <h1>Enter title here</h1>
            <div className="board">
                {/* title creation */}
                {
                    categorySet.size != 0 ? 
                    [...categorySet].map((cat, id) => (
                        <div className="title" key={id} contentEditable={editing}>
                            <span>{cat}</span>
                        </div>
                    ))
                    :
                    [...Array(6).keys()].map((_, id) => (
                        <div className="title" key={id}>
                            <span>enter title here</span>
                        </div>
                    ))
                }

                {/* Clue cells creation */}
                {   
                    cluesToPopulate.map((clue, _) => (
                        <div className="cell-wrapping" onClick={() => {
                            setSelectedClue(clue);
                            handleOpen();
                        }}>
                            <div className="cell">
                                <div className="cell-front">
                                    <span>{clue.clue}</span>
                                </div>
                                <div className="cell-back">
                                    <span>{clue.response}</span>
                                </div>
                            </div>
                            
                        </div>
                    ))
                }
            </div>

        </div>




    )









}