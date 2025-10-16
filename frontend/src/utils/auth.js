export function getToken() {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem('token');
}

export function setToken(token) {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem('token', token);
}

export function clearToken() {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem('token');
}

export function getUser() {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
}

export function setUser(user) {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem('user', JSON.stringify(user));
}

export function clearUser() {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem('user');
}


