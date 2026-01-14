import DOMPurify from 'dompurify';

export default function ProcessClueContent(html: string): { 
    hasMedia: boolean; 
    content: string 
} {

    console.log(html)

    const clean = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['img', 'video', 'source'],
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

        return { 
            hasMedia: false, 
            content: temp.textContent || temp.innerText || '' 
        };
    }
}