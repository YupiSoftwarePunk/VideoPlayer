import { openVideoPlayer } from './VideoPlayerModal.js';

export const VideoCard = (video) => {
    const card = document.createElement('div');
    card.className = 'border-3 border-neo-dark bg-white shadow-neo overflow-hidden hover:-translate-y-1 transition-transform cursor-pointer group';
    
    card.innerHTML = `
        <div class="aspect-video bg-neo-surface border-b-3 border-neo-dark flex items-center justify-center relative overflow-hidden">
            <div class="absolute inset-0 bg-neo-accent/10 group-hover:bg-neo-accent/20 transition-colors"></div>
            <span class="font-black uppercase text-2xl italic tracking-tighter opacity-20">Preview</span>
        </div>
        <div class="p-4">
            <h3 class="text-xl font-black mb-2 truncate uppercase italic">${video.title}</h3>
            <div class="flex justify-between items-center text-[10px] font-black">
                <span class="bg-neo-accent border-2 border-neo-dark px-2 py-0.5 shadow-neo-hover">@${video.author}</span>
                <span class="text-neo-dark uppercase">${video.likes || 0} REAX</span>
            </div>
        </div>
    `;

    card.onclick = () => openVideoPlayer(video);
    return card;
};