import Quill, { RangeStatic } from 'quill';

export function getQuillModulesClue() {
    return {
        toolbar: {
            container: [
                ['bold', 'italic', 'underline', { 'color': [] }, { 'background': [] }],
                ['image', 'video', 'formula', 'blockquote', 'code-block'],
                [{ 'script': 'sub'}, { 'script': 'super' }],
            ],
            handlers: {
                image: handleImageUpload
            },
        }
    };
}

export function getQuillModulesResponse() {
    return {
        toolbar: {
            container: [
                ['bold', 'italic', 'underline', { 'color': [] }, { 'background': [] }],
                ['formula', 'blockquote', 'code-block'],
                [{ 'script': 'sub'}, { 'script': 'super' }],
            ],
        }
    };
}

function handleImageUpload(this: { quill: Quill }) {
    const choice = window.confirm('OK for URL, Cancel for file upload');
    
    if (choice) {
        const url = prompt('Enter image URL:');
        if (url) {
            const range = this.quill.getSelection() as RangeStatic;
            this.quill.insertEmbed(range.index, 'image', url);
        }
    } else {
        const range = this.quill.getSelection() as RangeStatic; 
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        
        input.addEventListener('change', () => {
            const file = input.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const base64 = e.target?.result as string;
                    this.quill.insertEmbed(range.index, 'image', base64);
                };
                reader.readAsDataURL(file);
            }
        });
        
        input.click();
    }
}