import axios from 'axios';

export const fetchRounds = async () => {
    const res = await axios.get('/api/rounds', { withCredentials: true });
    return res.data;
};

export const createRound = async () => {
    const res = await axios.post('/api/rounds', {}, { withCredentials: true });
    return res.data;
};
