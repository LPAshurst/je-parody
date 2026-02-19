import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { type Clue } from '../../types';
import "../../styles/EditBoard/TextEditor.css";
import { useState, useEffect, useRef, useMemo } from 'react';
import { getQuillModules } from '../../utils/quillConfig';
import processClueContent from "../../utils/processClueContent";

interface TextEditorProps {
    selectedClue: Clue | null;
    onSave: (clue: Clue) => void;
    onClose: () => void;
}

export default function TextEditor({ selectedClue, onSave, onClose }: TextEditorProps) {
    const [clueText, setClueText] = useState('');
    const [answerText, setAnswerText] = useState('');
    const clueRef = useRef<ReactQuill>(null);
    const answerRef = useRef<ReactQuill>(null);

    useEffect(() => {
        if (selectedClue) {
            setClueText(selectedClue.clue);
            setAnswerText(selectedClue.response);
        }
    }, [selectedClue]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    // both the clueModules and answerModules below are for tab key context switching between editors
    // I wont lie im lowkey a fraud i had AI help with the memo thing
    // the problem was that the error squigglies kept rerendering and this was the fix
    const clueModules = useMemo(() => ({
        ...getQuillModules(),
        keyboard: {
            bindings: {
                tab: {
                    key: 'Tab',
                    handler() {
                        answerRef.current?.getEditor().focus();
                        return false;
                    },
                },
            },
        },
    }), []);

    const answerModules = useMemo(() => ({
        ...getQuillModules(),
        keyboard: {
            bindings: {
                tab: {
                    key: 'Tab',
                    handler() {
                        clueRef.current?.getEditor().focus();
                        return false;
                    },
                },
            },
        },
    }), [])

    const handleSave = () => {
        if (!selectedClue) return;
        const clue = processClueContent(clueText);
        const answer = processClueContent(answerText);
        const updatedClue: Clue = {
            ...selectedClue,
            clue: clue.content,
            response: answer.content,
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
                <div className="left-quill">
                    <h2>Clue Prompt</h2>
                    <ReactQuill
                        ref={clueRef}
                        theme="snow"
                        modules={clueModules}
                        value={clueText}
                        onChange={setClueText}
                        placeholder="Enter clue here"
                    />
                </div>
                <div className="right-quill">
                    <h2>Correct Answer</h2>
                    <ReactQuill
                        ref={answerRef}
                        theme="snow"
                        modules={answerModules}
                        value={answerText}
                        onChange={setAnswerText}
                        placeholder="Enter response here"
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