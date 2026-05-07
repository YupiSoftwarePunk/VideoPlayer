export const Button = (text, onClick, variant = 'primary', extraClasses = '') => {
    const variants = {
        primary: 'bg-neo-accent hover:bg-opacity-80',
        danger: 'bg-neo-danger text-white',
        secondary: 'bg-neo-surface'
    };

    const btn = document.createElement('button');
    btn.className = `px-6 py-2 border-3 border-neo-dark shadow-neo active:shadow-neo-active 
        active:translate-x-[2px] active:translate-y-[2px] transition-all font-bold uppercase 
        hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all 
        tracking-wider ${variants[variant]} ${extraClasses}`;
    btn.innerText = text;
    btn.onclick = onClick;
    
    return btn;
};