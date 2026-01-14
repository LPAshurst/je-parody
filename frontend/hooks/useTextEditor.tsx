// hooks/useBoardEditor.ts
import { useState } from 'react';
import { type Clue } from '../types';

export default function useTextEditor(initialClues: Clue[]) {
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

    const updateClue = (updatedClue: Clue) => {
        setClues(prev => prev.map(c => 
            c.id === updatedClue.id ? updatedClue : c
        ));

        // FIXME
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