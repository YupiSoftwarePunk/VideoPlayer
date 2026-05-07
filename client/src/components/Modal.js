export const Modal = (content) => {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-neo-dark/50 backdrop-blur-sm flex items-center justify-center z-50 p-4';
    
    const container = document.createElement('div');
    container.className = 'bg-neo-bg border-3 border-neo-dark shadow-neo p-8 max-w-md w-full relative';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'absolute top-2 right-2 font-black text-2xl hover:text-neo-danger';
    closeBtn.innerText = '×';
    closeBtn.onclick = () => overlay.remove();

    container.appendChild(closeBtn);
    container.appendChild(content);
    overlay.appendChild(container);

    return overlay;
};