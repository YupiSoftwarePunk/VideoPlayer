import './style.css';
import { App } from './App.js';

const init = () => {
    const rootElement = document.getElementById('app');
    rootElement.appendChild(App());
};

init();