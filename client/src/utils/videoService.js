import { authService } from './Aauth.js';

const API_BASE = 'http://localhost:5113';
export { API_BASE };

export const reactToVideo = async (videoId, isLike) => {
    try {
        const response = await fetch(`${API_BASE}/videos/${videoId}/react`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authService.getToken()}`
            },
            body: JSON.stringify({ isLike }) 
        });
        return response;
    } 
    catch (error) {
        console.error("Ошибка реакции:", error);
        throw error;
    }
};

export const fetchVideos = async () => {
    try {
        const response = await fetch(`${API_BASE}/videos`, {
            headers: { 'Authorization': `Bearer ${authService.getToken()}` }
        });
        if (!response.ok) throw new Error('Ошибка при загрузке');
        return await response.json();
    } 
    catch (error) {
        return [];
    }
};

export const postComment = async (videoId, text) => {
    try {
        const response = await fetch(`${API_BASE}/videos/${videoId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authService.getToken()}`
            },
            body: JSON.stringify({ text })
        });
        return response;
    } 
    catch (error) {
        throw error;
    }
};