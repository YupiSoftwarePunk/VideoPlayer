export const authService = {
    setToken: (token) => localStorage.setItem('token', token),
    getToken: () => localStorage.getItem('token'),
    removeToken: () => localStorage.removeItem('token'),
    isLoggedIn: () => !!localStorage.getItem('token'),

    getUser: () => {
    const token = authService.getToken();
    if (!token) return null;

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);

        return {
            id: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
            username: payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ? 
                    payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] : payload.unique_name,
            role: payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
        };
        } 
        catch (e) {
            console.error("Ошибка парсинга токена", e);
            return null;
        }
    },

    logout: () => {
        authService.removeToken();
        window.location.reload(); 
    }
};