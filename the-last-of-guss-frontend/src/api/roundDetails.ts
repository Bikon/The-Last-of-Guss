import axios from 'axios';

export const fetchRoundDetails = async (id: string) => {
    const res = await axios.get(`/api/rounds/${id}`, { withCredentials: true });
    return res.data;
};

export const tapGuss = async (id: string) => {
    const res = await axios.post(`/api/rounds/${id}/tap`, {}, { withCredentials: true });
    return res.data;
};