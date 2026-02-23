import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { type Clue } from '../../types';
import "../../styles/EditBoard/TextEditor.css";
import { useState, useEffect, useRef, useMemo } from 'react';
import { getQuillModulesClue, getQuillModulesResponse } from '../../utils/quillConfig';
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
    const [isDailyDouble, setIsDailyDouble] = useState(selectedClue?.daily_double);
    const [saving, setSaving] = useState(false);

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
        ...getQuillModulesClue(),
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
        ...getQuillModulesResponse(),
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

    async function handleSave() {
        if (!selectedClue) return;
        setSaving(true)
        const clue = processClueContent(clueText);
        const answer = processClueContent(answerText);
        const updatedClue: Clue = {
            ...selectedClue,
            clue: clue.content,
            response: answer.content,
        };
        updatedClue.clue_is_picture = clue.hasMedia;
        if (clue.hasMedia) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(clue.content, 'text/html');
            const img = doc.querySelector('img');
            
            if (img && img.src.startsWith('data:')) {
                const blob = await fetch(img.src).then(r => r.blob());
                const formData = new FormData();
                formData.append('file', blob);
                
                const res = await fetch('/api/media/upload_image', { method: 'POST', body: formData });
                console.log("status:", res.status, res.url);
                if (!res.ok) {
                    if (res.status == 413) {
                        alert("Image is too big. Please dont troll me :3")
                    } else {
                        alert("Couldn't save the image for some reason. Try again in a bit and if it still doesnt work text me")
                    }
                    setSaving(false)
                    return
                } 
                
                const { url } = await res.json();
                img.src = url;
                updatedClue.clue = doc.body.innerHTML;
            }
        }

        onSave(updatedClue);
        setSaving(false)
        onClose();
    };

    return (
        <div className="editing-modal">
            <header className="editing-header">
                <div className="header-title">
                    {selectedClue?.category ?? "Category"} for {selectedClue?.clue_val}
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
                        onChange={(val) => { setClueText(val); }}
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
                <button
                    className={`daily-double-toggle ${isDailyDouble ? 'active' : ''}`}
                    onClick={() => {
                        const tmpPrev = !isDailyDouble
                        setIsDailyDouble(tmpPrev)
                        if (selectedClue) {
                            selectedClue.daily_double = tmpPrev
                        }
                    }}
                    type="button"
                    aria-pressed={isDailyDouble}
                    title="Mark as Daily Double"
                >
                    <svg className="star-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    Daily Double
                </button>
                <button onClick={onClose}>Cancel</button>
                <button onClick={handleSave}>{saving ? 'Saving...' : 'Save'}</button>
            </div>
        </div>
    );
}