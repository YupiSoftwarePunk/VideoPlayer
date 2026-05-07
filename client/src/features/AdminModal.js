import { authService } from '../utils/Aauth.js';
import { Button } from '../components/Button.js';

const API_BASE = 'http://localhost:5113/admin';

export const AdminModal = async () => {
    const { Modal } = await import('../components/Modal.js');
    
    const content = document.createElement('div');
    content.className = 'flex flex-col gap-6 w-[full] max-h-[85vh] overflow-hidden p-2';

    content.innerHTML = `
        <div class="flex justify-between items-center border-b-4 border-neo-dark pb-4">
            <h2 class="text-4xl font-black uppercase italic tracking-tighter">
                Control<span class="bg-neo-warning px-2 border-2 border-neo-dark ml-1 shadow-neo-hover">Panel</span>
            </h2>
        </div>
        
        <div class="grid grid-cols-12 gap-4">
            <div class="col-span-8">
                <label class="block font-black uppercase text-xs mb-1">Поиск по ID пользователя</label>
                <div class="flex gap-2">
                    <input type="number" id="user-id-search" placeholder="id" 
                        class="border-3 border-neo-dark p-3 bg-white shadow-neo-hover outline-none font-bold w-full focus:bg-neo-accent transition-colors">
                    <div id="search-btn-container"></div>
                </div>
            </div>
            <div class="col-span-4 flex items-end">
                <div id="refresh-btn-container" class="w-full"></div>
            </div>
        </div>

        <div class="grid grid-cols-12 gap-4 px-4 py-2 bg-neo-dark text-white font-black uppercase text-xs shadow-neo">
            <div class="col-span-1">ID</div>
            <div class="col-span-4">Название / Автор</div>
            <div class="col-span-3 text-center">Статус</div>
            <div class="col-span-4 text-right">Действия</div>
        </div>

        <div id="admin-video-list" class="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar" style="min-height: 400px;">
            <div class="flex items-center justify-center h-full py-20">
                <p class="font-black uppercase animate-bounce">Загрузка данных...</p>
            </div>
        </div>
    `;

    const videoList = content.querySelector('#admin-video-list');
    const searchBtnContainer = content.querySelector('#search-btn-container');
    const refreshBtnContainer = content.querySelector('#refresh-btn-container');
    const searchInput = content.querySelector('#user-id-search');

    searchBtnContainer.appendChild(Button('Найти ролики', async () => {
        loadVideos(`${API_BASE}/users/${searchInput.value}/videos`);
    }, 'primary', 'whitespace-nowrap h-full'));

    refreshBtnContainer.appendChild(Button('Все видео', async () => {
        loadVideos(`${API_BASE}/videos/all`);
    }, 'secondary', 'w-full h-full bg-neo-surface'));

    const loadVideos = async (url) => {
        videoList.innerHTML = '<div class="flex justify-center p-10"><p class="font-black animate-pulse">Загрузка...</p></div>';
        try {
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${authService.getToken()}` }
            });
            if (!response.ok) throw new Error('Ошибка доступа или пользователь не найден');
            const videos = await response.json();
            renderAdminVideos(videos, videoList);
        } catch (err) {
            videoList.innerHTML = `<div class="bg-neo-danger text-white p-4 border-3 border-neo-dark font-black uppercase text-center">${err.message}</div>`;
        }
    };

    loadVideos(`${API_BASE}/videos/all`);
    return Modal(content);
};

function renderAdminVideos(videos, container) {
    if (videos.length === 0) {
        container.innerHTML = '<p class="text-center font-bold p-10 uppercase">Видео не найдены</p>';
        return;
    }

    container.innerHTML = '';
    videos.forEach(video => {
        const card = document.createElement('div');
        card.className = `grid grid-cols-12 gap-4 items-center p-4 border-3 border-neo-dark shadow-neo transition-all ${video.isRestricted ? 'bg-gray-100 opacity-80' : 'bg-white'}`;
        
        const statusIcon = video.isRestricted 
            ? `<span class="bg-neo-danger text-white px-2 py-1 border-2 border-neo-dark text-[10px] font-black uppercase">BANNED</span>`
            : `<span class="bg-green-400 px-2 py-1 border-2 border-neo-dark text-[10px] font-black uppercase">LIVE</span>`;

        card.innerHTML = `
            <div class="col-span-1 font-black text-neo-dark/40 italic">#${video.id}</div>
            <div class="col-span-4 overflow-hidden">
                <p class="font-black uppercase truncate text-sm leading-tight">${video.title}</p>
                <p class="text-[10px] font-bold text-neo-dark/60">Автор: ${video.authorName || 'User #' + video.authorId}</p>
            </div>
            <div class="col-span-3 text-center">
                ${statusIcon}
            </div>
            <div class="col-span-4 flex justify-end gap-2 action-btns"></div>
        `;

        const btnGroup = card.querySelector('.action-btns');

        const restrictBtn = Button(
            video.isRestricted ? 'Разбанить' : 'Ограничить', 
            () => toggleRestriction(video),
            video.isRestricted ? 'primary' : 'secondary',
            `text-[10px] py-1 px-3 ${video.isRestricted ? 'bg-neo-accent' : 'bg-neo-danger'}`
        );

        btnGroup.appendChild(restrictBtn);
        container.appendChild(card);
    });
}

async function toggleRestriction(video) {
    const reason = video.isRestricted ? "" : prompt(`Причина ограничения для "${video.title}":`);
    if (!video.isRestricted && reason === null) return;

    try {
        const response = await fetch(`${API_BASE}/videos/${video.id}/restrict`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authService.getToken()}`
            },
            body: JSON.stringify({ isRestricted: !video.isRestricted, reason: reason })
        });

        if (response.ok) {
            alert("Статус видео успешно изменен");
            window.location.reload(); 
        }
    } 
    catch (err) {
        alert("Ошибка сети");
    }
}