import api from './axios';

export const login = async (username: string, password: string) =>
    api.post('/api/login', { username, password }).then(res => res.data);

export const fetchMe = async () =>
    api.get('/api/me').then(res => res.data);

export const logout = async () =>
    api.post('/api/logout').then(res => res.data);
