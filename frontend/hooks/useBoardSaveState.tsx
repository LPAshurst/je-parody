// hooks/useBoardEditor.ts
import { useState } from 'react';
import { type Clue, type Board } from '../types';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";


export default function useBoardSaveState(initialClues: Clue[], boardTitle: string) {
    const [clues, setClues] = useState<Clue[]>(initialClues);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedClue, setSelectedClue] = useState<Clue | null>(null);
    const [isSaved, setSaved] = useState(true);

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

    function updateClue (updatedClue: Clue) {
        const updatedClues = clues.map(c => 
            c.id === updatedClue.id ? updatedClue : c
        );

        setClues(updatedClues)
        saveBoard(updatedClues, "")
    }

    async function saveBoard(cluesToSave?: Clue[], titleToSave?: string) {
        const board: Board = {
            title: titleToSave ? titleToSave : boardTitle,
            clues: cluesToSave ? cluesToSave : clues,
            slug: slug || ""
        }

        if (!board.title) {
            // No title should fail to save
            return;
        }

        const res = await fetch(`/api/boards/save_full_board`, {
            method: "POST",
            body: JSON.stringify(board),
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        })

        if (!res.ok) {
            return;
        }
        
        if (!slug) {
            const updatedSlug = await res.json();
            navigate(`/edit/${updatedSlug}`);
        }
        setSaved(true)
    };

    return {
        clues,
        modalOpen,
        selectedClue,
        openTextEditor,
        closeTextEditor,
        updateClue,
        saveBoard,
        setClues,
        isSaved,
        setSaved
    };
}