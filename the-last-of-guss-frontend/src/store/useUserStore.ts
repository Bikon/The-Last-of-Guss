import { create } from 'zustand';

interface UserState {
    username: string;
    role: string;
    isAuth: boolean;
    setUser: (data: { username: string; role: string }) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    username: '',
    role: '',
    isAuth: false,
    setUser: ({ username, role }) => set({ username, role, isAuth: true }),
    logout: () => set({ username: '', role: '', isAuth: false }),
}));
