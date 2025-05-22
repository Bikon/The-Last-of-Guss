import axios from 'axios';
export const fetchRoundDetails = (id: string) =>
  axios.get(`/api/rounds/${id}`, { withCredentials: true }).then(res => res.data);
export const tapGuss = (id: string) =>
  axios.post(`/api/rounds/${id}/tap`, {}, { withCredentials: true }).then(res => res.data);
