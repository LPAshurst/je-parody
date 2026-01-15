// hooks/useBoardEditor.ts
import { useState } from 'react';
import { type Clue, type Board } from '../types';
import { useNavigate } from 'react-router-dom';

export default function useTextEditor(initialClues: Clue[], isNewBoard: boolean, boardTitle: string) {
    const [clues, setClues] = useState<Clue[]>(initialClues);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedClue, setSelectedClue] = useState<Clue | null>(null);

    const openTextEditor = (clue: Clue) => {
        setSelectedClue(clue);
        setModalOpen(true);
    };

    const closeTextEditor = () => {
        setModalOpen(false);
        setSelectedClue(null);
    };

    async function updateClue(updatedClue: Clue) {
        const updatedClues = clues.map(c => 
            c.id === updatedClue.id ? updatedClue : c
        );
        setClues(updatedClues);

        if (isNewBoard) {
            // save entire board

            const board: Board = {
                title: boardTitle,
                clues: updatedClues 
            }
        
            const res = await fetch(`${import.meta.env.VITE_BACKEND_BOARD_API}/save_full_board`, {
                method: "POST",
                body: JSON.stringify(board),
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            })
            if (!res.ok) {
                console.log("didnt work :(")
                return;
            } else {
                console.log("it did work tbh")
            }

            const data = await res.json();
            console.log(data)


        } else {
            // save specific clue
        }

    };

    return {
        clues,
        modalOpen,
        selectedClue,
        openTextEditor,
        closeTextEditor,
        updateClue,
    };
}