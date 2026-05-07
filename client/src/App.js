import { Header } from './components/Header.js';
import { VideoCard } from './features/VideoCard.js';

export const App = () => {
    const root = document.createElement('div');
    root.className = 'min-h-screen flex flex-col';

    root.appendChild(Header());

    const main = document.createElement('main');
    main.className = 'p-8 flex-grow';
    
    main.innerHTML = `
        <h1 class="text-5xl font-black uppercase mb-12 underline decoration-neo-accent">Популярные видео</h1>
        <div id="video-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"></div>
    `;

    root.appendChild(main);

    const mockVideos = [
        { id: 1, title: 'Extreme Coding in Neo Style', author: 'admin', likes: 120 },
        { id: 2, title: 'How to build a VHS player', author: 'user1', likes: 45 },
        { id: 3, title: 'Post-irony tutorial', author: 'meta_guru', likes: 890 },
        { id: 4, title: 'PostgreSQL vs The World', author: 'db_master', likes: 12 },
    ];

    const grid = main.querySelector('#video-grid');
    mockVideos.forEach(v => grid.appendChild(VideoCard(v)));

    return root;
};