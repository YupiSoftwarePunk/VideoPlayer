import { authService } from '../utils/Aauth.js';
import { Button } from '../components/Button.js';
const { Modal } = await import('../components/Modal.js');

const API_URL = 'http://localhost:5113/auth';

export const AuthModal = (type = 'login') => {
    const content = document.createElement('div');
    const isLogin = type === 'login';

    content.innerHTML = `
        <h2 class="text-3xl font-black uppercase mb-6 underline">${isLogin ? 'Вход' : 'Регистрация'}</h2>
        <form id="auth-form" class="flex flex-col gap-4">
        <input type="text" name="username" placeholder="USERNAME" required 
            class="border-3 border-neo-dark p-2 focus:bg-neo-accent outline-none font-bold">
        <input type="password" name="password" placeholder="PASSWORD" required 
            class="border-3 border-neo-dark p-2 focus:bg-neo-accent outline-none font-bold">
        <div id="auth-error" class="text-neo-danger font-bold text-sm hidden"></div>
        <div id="submit-container"></div>
        </form>
        <p class="mt-4 text-sm font-bold cursor-pointer hover:underline uppercase" id="switch-auth">
        ${isLogin ? 'Нет аккаунта? Создать' : 'Уже есть аккаунт? Войти'}
        </p>
    `;

    const form = content.querySelector('#auth-form');
    const errorDiv = content.querySelector('#auth-error');

    const submitBtn = Button(isLogin ? 'Войти' : 'Зарегистрироваться', null, 'primary', 'w-full');
    content.querySelector('#submit-container').appendChild(submitBtn);

    content.querySelector('#switch-auth').onclick = () => {
        const modal = document.querySelector('.fixed.inset-0');
        modal.remove();
        document.body.appendChild(AuthModal(isLogin ? 'register' : 'login'));
    };

    form.onsubmit = async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        const endpoint = isLogin ? '/login' : '/register';

        try {
            const res = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!res.ok) throw new Error(await res.text());

            if (isLogin) {
                const { token } = await res.json();
                authService.setToken(token);
                window.location.reload();
            } 
            else {
                alert('Регистрация успешна! Теперь войдите.');
                content.querySelector('#switch-auth').click();
            }
        } 
        catch (err) {
            errorDiv.innerText = err.message;
            errorDiv.classList.remove('hidden');
        }
    };
    return Modal(content);
};