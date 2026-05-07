import { authService } from '../utils/Aauth.js';
import { Button } from '../components/Button.js';

const API_URL = 'http://localhost:5113/videos/upload';

export const UploadModal = async () => {
    const { Modal } = await import('../components/Modal.js');
    const content = document.createElement('div');
    content.className = 'flex flex-col gap-6';

    content.innerHTML = `
        <h2 class="text-3xl font-black uppercase underline decoration-neo-accent">Загрузка видео</h2>
        
        <form id="upload-form" class="flex flex-col gap-5">
            <div class="flex flex-col gap-2">
                <label class="font-black uppercase text-sm">Название ролика:</label>
                <input type="text" name="title" placeholder="Введите название..." required 
                    class="border-3 border-neo-dark p-3 bg-white shadow-neo-hover focus:shadow-neo focus:bg-neo-accent outline-none transition-all font-bold">
            </div>

            <div class="flex flex-col gap-2">
                <label class="font-black uppercase text-sm">Выберите файл (.mp4, .mov):</label>
                <input type="file" name="video" accept="video/*" required 
                    class="file:mr-4 file:py-2 file:px-4 file:border-3 file:border-neo-dark file:bg-neo-surface file:font-black file:uppercase cursor-pointer border-3 border-neo-dark p-2 bg-white shadow-neo-hover font-bold">
            </div>

            <div id="upload-error" class="hidden bg-neo-danger text-white border-3 border-neo-dark p-2 font-bold text-center uppercase text-sm"></div>

            <div id="upload-submit-container"></div>
        </form>
    `;

    const form = content.querySelector('#upload-form');
    const errorDiv = content.querySelector('#upload-error');
    const submitContainer = content.querySelector('#upload-submit-container');

    const submitBtn = Button('Опубликовать видео', null, 'primary', 'w-full py-4 text-xl');
    submitContainer.appendChild(submitBtn);

    form.onsubmit = async (e) => {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.innerText = 'Загрузка...';
        errorDiv.classList.add('hidden');

        const formData = new FormData(form);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authService.getToken()}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Ошибка сервера');
            }

            alert('Видео успешно загружено!');
            window.location.reload(); 

        } 
        catch (err) {
            errorDiv.innerText = `Ошибка: ${err.message}`;
            errorDiv.classList.remove('hidden');
            submitBtn.disabled = false;
            submitBtn.innerText = 'Опубликовать видео';
        }
    };
    return Modal(content);
};