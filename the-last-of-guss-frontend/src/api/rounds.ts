import axios from 'axios';
export const fetchRounds = async () =>
  axios.get('/api/rounds', { withCredentials: true }).then(res => res.data);
export const createRound = async () =>
  axios.post('/api/rounds', {}, { withCredentials: true }).then(res => res.data);
