import api from './axios';

export const fetchRoundDetails = (id: string) =>
    api.get(`/api/rounds/${id}`).then(res => res.data);

export const tapGuss = (id: string) =>
    api.post(`/api/rounds/${id}/tap`).then(res => res.data);
