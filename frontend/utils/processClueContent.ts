import DOMPurify from 'dompurify';

export default function processClueContent(html: string): { 
    hasMedia: boolean; 
    content: string 
} {
    
    const clean = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['img', 'video'],
        ALLOWED_ATTR: ['src', 'alt', 'controls', 'width', 'height', 'type']
    });

    const temp = document.createElement('div');
    temp.innerHTML = clean;


    const hasImg = temp.querySelector('img');
    const hasVideo = temp.querySelector('video');
    const hasMedia = !!(hasImg || hasVideo);

    // doing this because i want the preview for a clue to be a picture/video if thats what is used and just the text otherwise
    if (hasMedia) {
        return { 
            hasMedia: true, 
            content: clean 
        };
    } else {

        let text = temp.textContent || temp.innerText || ''

        text = text.replace(/\u00A0/g, ' ');

        return { 
            hasMedia: false, 
            content: text 
        };
    }
}