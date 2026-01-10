import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'
import { Clue } from '../types';
import "../styles/WYSIWYG.css"

export default function WYSIWYG({ selectedClue }: { selectedClue: Clue | null }) {


    const toolbarOptions = [
        // [{ 'header': [1, 2, 3, 4, false] }, { 'font': [] },], not neaded for now
        // [{ 'list': 'ordered'}, { 'list': 'bullet' }], not needed for now either

        ['bold', 'italic', 'underline', { 'color': [] }, { 'background': [] }],        // toggled buttons

        ['image', 'video', 'formula', 'blockquote', 'code-block'],
        
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    ];

    const modules = {
        toolbar: {
            container: toolbarOptions,
            handlers: {
            image: function() {
                const choice = window.confirm('OK for URL, Cancel for file upload');
                
                if (choice) {
                // URL option
                const url = prompt('Enter image URL:');
                if (url) {
                    const quill = this.quill;
                    const range = quill.getSelection();
                    quill.insertEmbed(range.index, 'image', url);
                }
                } else {
                // File upload option
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');
                input.click();
                
                    }
                }
            }
        }
    };


    return (
        <div className="quills">
            <div className='left-quill'>
                <span>Clue prompt</span>
                <ReactQuill
                    theme="snow"
                    modules={modules}
                    value={selectedClue ? selectedClue.clue : "Start typing please"}
                    onChange={() => console.log("Hello")}
                />
            </div>
            
            <div className='right-quill'>
                Correct response
                <ReactQuill
                    modules={modules}
                    theme="snow"
                    value={selectedClue ? selectedClue.response : "Start typing please"}
                    onChange={() => console.log("Hello")}
                />
            </div>
            
        </div>
    )
}
