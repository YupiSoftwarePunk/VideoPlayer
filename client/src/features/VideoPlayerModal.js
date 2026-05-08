import { Button } from '../components/Button.js';
import { reactToVideo, postComment, API_BASE } from '../utils/videoService.js';

export const openVideoPlayer = (video) => {
    const videoFullSrc = `${API_BASE}${video.url}`;
    let currentComments = video.comments || [];

    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4';
    
    overlay.innerHTML = `
        <div class="bg-white border-4 border-neo-dark shadow-neo w-full max-w-5xl max-h-[95vh] flex flex-col relative overflow-hidden">
            <button id="close-player" class="absolute top-4 right-4 z-50 bg-neo-danger border-2 border-neo-dark p-2 text-white font-bold shadow-neo hover:translate-x-0.5 active:shadow-none transition-all">✕</button>

            <div class="overflow-y-auto p-6 custom-scrollbar">
                <div class="border-4 border-neo-dark bg-black shadow-neo aspect-video relative overflow-hidden mb-6">
                    <video id="main-player" controls autoplay class="w-full h-full">
                        <source src="${videoFullSrc}" type="video/mp4">
                    </video>
                </div>

                <div class="flex justify-between items-start border-b-4 border-neo-dark pb-6 mb-6">
                    <div>
                        <h2 class="text-4xl font-black uppercase italic mb-2">${video.title}</h2>
                        <span class="bg-neo-accent border-2 border-neo-dark px-3 py-1 font-bold">@${video.author}</span>
                    </div>
                    <div class="flex gap-4" id="reaction-btns"></div>
                </div>

                <div class="flex flex-col gap-4">
                    <h3 class="text-2xl font-black uppercase" id="comm-title">Обсуждение (${currentComments.length})</h3>
                    <div class="flex gap-2">
                        <input type="text" id="comm-input" placeholder="Напиши что-нибудь..." 
                            class="border-3 border-neo-dark p-4 bg-white w-full font-bold outline-none focus:bg-neo-accent transition-colors shadow-neo">
                        <div id="send-comm-wrap"></div>
                    </div>
                    <div id="comm-list" class="flex flex-col gap-3 mt-4"></div>
                </div>
            </div>
        </div>
    `;

    const renderComments = () => {
        const list = overlay.querySelector('#comm-list');
        const title = overlay.querySelector('#comm-title');
        
        title.innerText = `Обсуждение (${currentComments.length})`;
        
        if (currentComments.length === 0) {
            list.innerHTML = '<p class="italic font-bold opacity-40 uppercase">Здесь пока тихо... Будь первым!</p>';
            return;
        }

        list.innerHTML = currentComments.map(c => `
            <div class="border-3 border-neo-dark p-4 bg-neo-surface shadow-neo animate-in slide-in-from-left duration-300">
                <p class="text-xs font-black uppercase text-black/50 mb-1">@${c.user || 'Вы'}</p>
                <p class="font-bold text-sm">${c.text}</p>
            </div>
        `).join('');
    };

    renderComments();

    const reactionContainer = overlay.querySelector('#reaction-btns');

    let likesCount = video.likes || 0;
    let dislikesCount = video.dislikes || 0;

    const likeBtn = Button(`${likesCount} 👍`, async () => {
        const res = await reactToVideo(video.id, true);
        if (res.ok) {
            likesCount++;
            likeBtn.innerText = `${likesCount} 👍`;
        }
    }, 'primary');

    const dislikeBtn = Button(`${dislikesCount} 👎`, async () => {
        const res = await reactToVideo(video.id, false);
        if (res.ok) {
            dislikesCount++;
            dislikeBtn.innerText = `${dislikesCount} 👎`;
        }
    }, 'secondary');

    reactionContainer.append(likeBtn, dislikeBtn);

    overlay.querySelector('#send-comm-wrap').append(
        Button('ОТПРАВИТЬ', async () => {
            const input = overlay.querySelector('#comm-input');
            const text = input.value.trim();
            if (!text) return;

            const res = await postComment(video.id, text);
            if (res.ok) {
                currentComments.unshift({ user: 'Вы', text: text });
                renderComments();
                input.value = '';
            }
        })
    );

    overlay.querySelector('#close-player').onclick = () => overlay.remove();
    document.body.appendChild(overlay);
};