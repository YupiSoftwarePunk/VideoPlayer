export const authService = {
    setToken: (token) => localStorage.setItem('token', token),
    getToken: () => localStorage.getItem('token'),
    removeToken: () => localStorage.removeItem('token'),
    isLoggedIn: () => !!localStorage.getItem('token'),

    logout: () => {
        authService.removeToken();
        window.location.reload(); 
    }
};