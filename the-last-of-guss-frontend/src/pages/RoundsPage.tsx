import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRounds, createRound } from '../api/rounds';
import { logout as apiLogout } from '../api/auth';
import { useUserStore } from '../store/useUserStore';

interface Round {
    id: string;
    startAt: string;
    endAt: string;
    cooldownStart: string;
    status: 'cooldown' | 'active' | 'ended';
}

export default function RoundsPage() {
    const [rounds, setRounds] = useState<Round[]>([]);
    const { username, role, logout } = useUserStore();
    const navigate = useNavigate();

    const loadRounds = async () => {
        try {
            const data = await fetchRounds() as Round[];
            setRounds(data);
        } catch (e) {
            console.error('Ошибка загрузки раундов');
        }
    };

    const handleCreate = async () => {
        const round = await createRound() as Round;
        navigate(`/round/${round.id}`);
    };

    const handleLogout = async () => {
        await apiLogout();
        logout();
        navigate('/login');
    };

    useEffect(() => {
        loadRounds();
        const timer = setInterval(loadRounds, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Список раундов — {username}</h2>
                <button onClick={handleLogout}>Выйти</button>
            </div>

            {role === 'admin' && (
                <button onClick={handleCreate} style={{ marginBottom: 16 }}>
                    Создать раунд
                </button>
            )}

            {rounds.map(r => (
                <div
                    key={r.id}
                    style={{ border: '1px solid #ccc', padding: 12, marginBottom: 12, borderRadius: 6, cursor: 'pointer' }}
                    onClick={() => navigate(`/round/${r.id}`)}
                >
                    <div><strong>Round ID:</strong> {r.id}</div>
                    <div>Start: {new Date(r.startAt).toLocaleString()}</div>
                    <div>End: {new Date(r.endAt).toLocaleString()}</div>
                    <div><strong>Статус:</strong> {r.status === 'cooldown' ? 'Cooldown' : r.status === 'active' ? 'Активен' : 'Завершён'}</div>
                </div>
            ))}
        </div>
    );
}
