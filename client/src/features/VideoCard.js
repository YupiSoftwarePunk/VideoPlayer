export const VideoCard = (video) => {
    const card = document.createElement('div');
    card.className = 'border-3 border-neo-dark bg-white shadow-neo overflow-hidden hover:-translate-y-1 transition-transform';
    
    card.innerHTML = `
        <div class="aspect-video bg-neo-surface border-b-3 border-neo-dark flex items-center justify-center relative">
            <span class="font-bold uppercase">Preview</span>
            <div class="absolute bottom-2 right-2 bg-neo-dark text-neo-accent px-2 text-sm font-bold">12:44</div>
        </div>
        <div class="p-4">
        <h3 class="text-xl font-bold mb-2 truncate uppercase">${video.title}</h3>
        <div class="flex justify-between items-center text-sm font-bold">
            <span class="bg-neo-surface border-2 border-neo-dark px-2">${video.author}</span>
            <span class="text-neo-dark/60">${video.likes} LIKES</span>
        </div>
        </div>
    `;

    card.onclick = () => console.log(`Open video ${video.id}`);
    return card;
};