export function getQuillModules() {
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

function handleImageUpload(this: any) {
    const choice = window.confirm('OK for URL, Cancel for file upload');
    
    if (choice) {
        const url = prompt('Enter image URL:');
        if (url) {
            const range = this.quill.getSelection();
            this.quill.insertEmbed(range.index, 'image', url);
        }
    } else {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
        // Add file upload handler here
    }
}