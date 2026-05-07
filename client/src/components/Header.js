import { Button } from './Button.js';
import { authService } from '../utils/Aauth.js';
import { AuthModal } from '../features/AuthModal.js';

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

    if (authService.isLoggedIn()) {
    container.appendChild(Button('Загрузить', () => console.log('Open Upload Modal'), 'primary'));
    container.appendChild(Button('Выйти', () => authService.logout(), 'secondary'));
    } 
    else {
    container.appendChild(Button('Войти', () => document.body.appendChild(AuthModal('login')), 'secondary'));
    container.appendChild(Button('Создать аккаунт', () => document.body.appendChild(AuthModal('register')), 'primary'));
    }
    return header;
};