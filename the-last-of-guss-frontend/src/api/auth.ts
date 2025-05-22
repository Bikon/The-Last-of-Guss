import axios from 'axios';

export const login = async (username: string, password: string) => {
    const res = await axios.post('/api/login', { username, password }, { withCredentials: true });
    return res.data;
};

export const fetchMe = async () => {
    const res = await axios.get('/api/me', { withCredentials: true });
    return res.data;
};
