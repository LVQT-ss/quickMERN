const BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 'http://localhost:3000/api';

async function request(path, { method = 'GET', token, body } = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) {
        const message = data?.message || res.statusText;
        throw new Error(message);
    }
    return data;
}

export const api = {
    auth: {
        register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
        login: (payload) => request('/auth/login', { method: 'POST', body: payload })
    },
    users: {
        create: (payload) => request('/users', { method: 'POST', body: payload }),
        list: (token) => request('/users', { token }),
        get: (id, token) => request(`/users/${id}`, { token }),
        update: (id, payload, token) => request(`/users/${id}`, { method: 'PUT', body: payload, token }),
        remove: (id, token) => request(`/users/${id}`, { method: 'DELETE', token })
    },
    posts: {
        create: (payload, token) => request('/posts', { method: 'POST', body: payload, token }),
        list: (params = {}) => {
            const cleaned = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== ''))
            const qs = new URLSearchParams(cleaned).toString();
            return request(`/posts${qs ? `?${qs}` : ''}`);
        },
        trending: (limit = 5) => request(`/posts/trending?limit=${limit}`),
        get: (id) => request(`/posts/${id}`),
        update: (id, payload, token) => request(`/posts/${id}`, { method: 'PUT', body: payload, token }),
        remove: (id, token) => request(`/posts/${id}`, { method: 'DELETE', token }),
        sections: {
            add: (postId, payload, token) => request(`/posts/${postId}/sections`, { method: 'POST', body: payload, token }),
            update: (postId, sectionId, payload, token) => request(`/posts/${postId}/sections/${sectionId}`, { method: 'PUT', body: payload, token }),
            remove: (postId, sectionId, token) => request(`/posts/${postId}/sections/${sectionId}`, { method: 'DELETE', token })
        },
        images: {
            add: (postId, payload, token) => request(`/posts/${postId}/images`, { method: 'POST', body: payload, token }),
            update: (postId, imageId, payload, token) => request(`/posts/${postId}/images/${imageId}`, { method: 'PUT', body: payload, token }),
            remove: (postId, imageId, token) => request(`/posts/${postId}/images/${imageId}`, { method: 'DELETE', token })
        },
        categories: {
            add: (postId, payload, token) => request(`/posts/${postId}/categories`, { method: 'POST', body: payload, token }),
            remove: (postId, categoryId, token) => request(`/posts/${postId}/categories/${categoryId}`, { method: 'DELETE', token })
        }
    },
    comments: {
        create: (payload, token) => request('/comments', { method: 'POST', body: payload, token }),
        listByPost: (postId) => request(`/comments?post_id=${encodeURIComponent(postId)}`),
        listByUser: (userId) => request(`/comments?user_id=${encodeURIComponent(userId)}`),
        update: (id, payload, token) => request(`/comments/${id}`, { method: 'PUT', body: payload, token }),
        remove: (id, token) => request(`/comments/${id}`, { method: 'DELETE', token })
    },
    likes: {
        toggle: (postId, token) => request('/post-likes', { method: 'POST', body: { post_id: postId }, token }),
        list: (postId) => request(`/post-likes?post_id=${encodeURIComponent(postId)}`),
        count: (postId) => request(`/post-likes/count?post_id=${encodeURIComponent(postId)}`)
    },
    categories: {
        create: (payload, token) => request('/categories', { method: 'POST', body: payload, token }),
        list: () => request('/categories'),
        get: (id, token) => request(`/categories/${id}`, { token }),
        update: (id, payload, token) => request(`/categories/${id}`, { method: 'PUT', body: payload, token }),
        remove: (id, token) => request(`/categories/${id}`, { method: 'DELETE', token })
    }
};

export default api;


