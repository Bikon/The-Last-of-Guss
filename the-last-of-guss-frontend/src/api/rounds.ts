import api from './axios';

export const fetchRounds = async () =>
    api.get('/api/rounds').then(res => res.data);

export const createRound = async () =>
    api.post('/api/rounds').then(res => res.data);
