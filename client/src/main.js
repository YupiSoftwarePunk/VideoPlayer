import './style.css';
import { App } from './App.js';
import { fetchVideos } from './utils/videoService.js';
import { VideoCard } from './features/VideoCard.js';

const init = async () => {
    const rootElement = document.getElementById('app');
    rootElement.appendChild(App());

    const videoGrid = document.querySelector('#video-grid');
    if (!videoGrid) return;

    videoGrid.innerHTML = '<p class="font-black uppercase animate-pulse">Стягиваем контент...</p>';

    const videos = await fetchVideos();

    if (videos.length === 0) {
        videoGrid.innerHTML = '<p class="font-black uppercase">Видео пока нет. Будь первым!</p>';
        return;
    }

    videoGrid.innerHTML = '';
    videos.forEach(video => {
        const card = VideoCard(video);
        videoGrid.appendChild(card);
    });
};

window.addEventListener('DOMContentLoaded', init());