// hooks/useBoardEditor.ts
import { useState } from 'react';
import { type Clue, type Board } from '../types';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";


export default function useTextEditor(initialClues: Clue[], boardTitle: string) {
    const [clues, setClues] = useState<Clue[]>(initialClues);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedClue, setSelectedClue] = useState<Clue | null>(null);

    const navigate = useNavigate();
    const { slug } = useParams();

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

        if (!slug) {
            // save entire board

            const board: Board = {
                title: boardTitle,
                clues: updatedClues,
                slug: "" // send dummy slug for now. the server will make one for us anyway
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
                setClues(updatedClues);
                console.log("it did work tbh")
                console.log(res.statusText)
            }

            const updatedSlug = await res.json();
            navigate(`/edit/${updatedSlug}`)


        } else {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_CLUE_API}/update_clue/${slug}`, {
                method: "PUT",
                body: JSON.stringify(updatedClue),
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            })
            if (!res.ok) {
                console.log("didnt work :(")
                return;
            } else {
                setClues(updatedClues);
                console.log("it did work tbh")
            }
        }

    };

    return {
        clues,
        modalOpen,
        selectedClue,
        openTextEditor,
        closeTextEditor,
        updateClue,
        setClues
    };
}