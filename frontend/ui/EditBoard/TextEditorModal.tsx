import { Modal } from "@mui/material";
import TextEditor from "./TextEditor";
import { type Clue } from "../../types";

interface TextEditorModalProps {
    modalOpen: boolean;
    clue: Clue | null;
    handleClose: () => void;
    onSave: (clue: Clue) => void;
}

export default function TextEditorModal({ modalOpen, clue, handleClose, onSave }: TextEditorModalProps) {    
    return (
        <Modal 
            open={modalOpen}
            onClose={(_, reason) => {
                if (reason === 'escapeKeyDown') {
                    handleClose();
                }
            }}
        >
            <TextEditor 
                selectedClue={clue} 
                onClose={handleClose}
                onSave={onSave}
            />
        </Modal>
    )
}