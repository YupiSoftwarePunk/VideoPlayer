import { Button } from './Button.js';
import { authService } from '../utils/Aauth.js';
import { AuthModal } from '../features/AuthModal.js';
import { UploadModal } from '../features/UploadModal.js';
import { AdminModal } from '../features/AdminModal.js';

export const Header = () => {
    const header = document.createElement('header');
    header.className = 'border-b-3 border-neo-dark p-6 flex justify-between items-center bg-white';

    header.innerHTML = `
        <div class="text-3xl font-black italic tracking-tighter">
        VIDEO<span class="bg-neo-accent px-2 border-2 border-neo-dark ml-1">NEO</span>
        </div>
        <div id="auth-buttons" class="flex gap-4"></div>
    `;

    const container = header.querySelector('#auth-buttons');
    const user = authService.getUser();

    if (authService.isLoggedIn() && user) {
        container.appendChild(Button('Загрузить', async () => { 
            const modal = await UploadModal();
            document.body.appendChild(modal);
        }, 'primary'));

        if (user.role === 'Admin') {
            container.appendChild(Button('Админ панель', async () => {
                const modal = await AdminModal();
                document.body.appendChild(modal);
            }, 'secondary', 'bg-neo-warning'));
        }

        container.appendChild(Button('Выйти', () => authService.logout(), 'secondary'));
    }
    else {
        container.appendChild(Button('Войти', () => document.body.appendChild(AuthModal('login')), 'secondary'));
        container.appendChild(Button('Создать аккаунт', () => document.body.appendChild(AuthModal('register')), 'primary'));
    }
    return header;
};