import DOMPurify from 'dompurify';

export default function processClueContent(html: string): { 
    hasMedia: boolean; 
    content: string 
} {
    const clean = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['img', 'video', 'b', 'strong', 'i', 'em', 'u'],
        ALLOWED_ATTR: ['src', 'alt', 'controls', 'width', 'height', 'type', 'style']
    });

    const temp = document.createElement('div');
    temp.innerHTML = clean;

    const hasImg = temp.querySelector('img');
    const hasVideo = temp.querySelector('video');
    const hasMedia = !!(hasImg || hasVideo);

    // \u00A0 cleanup now needs to happen on the HTML string, not plain text
    const content = clean.replace(/\u00A0/g, ' ');

    return { hasMedia, content };
}