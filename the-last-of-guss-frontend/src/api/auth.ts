import axios from 'axios';
export const login = async (username: string, password: string) =>
  axios.post('/api/login', { username, password }, { withCredentials: true }).then(res => res.data);
export const fetchMe = async () =>
  axios.get('/api/me', { withCredentials: true }).then(res => res.data);
