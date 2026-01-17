import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { type Clue } from '../../types';
import "../../styles/TextEditor.css";
import { useState, useEffect } from 'react';
import { getQuillModules } from '../../utils/quillConfig';

interface TextEditorProps {
    selectedClue: Clue | null;
    onSave: (clue: Clue) => void;
    onClose: () => void;
}

export default function TextEditor({ selectedClue, onSave, onClose }: TextEditorProps) {
    const [clueText, setClueText] = useState('');
    const [answerText, setAnswerText] = useState('');

    // update clue 
    useEffect(() => {
        if (selectedClue) {
            setClueText(selectedClue.clue);
            setAnswerText(selectedClue.response);
        }
    }, [selectedClue]);
    
    // escape key gets wonky when using both MUI and ReactQuill so this makes an explicit listener for Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    const handleSave = () => {
        if (!selectedClue) return;
        
        const updatedClue: Clue = {
            ...selectedClue,
            clue: clueText,
            response: answerText
        };
        
        onSave(updatedClue);
        onClose();
    };

    return (
        <div className="editing-modal">
            <header className="editing-header"> 
                <div className="header-title">
                    {selectedClue?.category ?? "Category"}
                </div>   
            </header>
            <div className="quills">
                <div className='left-quill'>
                    <h2>Clue prompt</h2>
                    <ReactQuill
                        theme="snow"
                        modules={getQuillModules()}
                        value={clueText}
                        onChange={setClueText}
                        placeholder='Enter clue here'
                    />
                </div>
                <div className='right-quill'>
                    <h2>Correct answer</h2>
                    <ReactQuill
                        theme="snow"
                        modules={getQuillModules()}
                        value={answerText}
                        onChange={setAnswerText}
                        placeholder='Enter response here'
                    />
                </div>
            </div>
            <div className="modal-actions">
                <button onClick={onClose}>Cancel</button>
                <button onClick={handleSave}>Save</button>
            </div>
        </div>
    );
}