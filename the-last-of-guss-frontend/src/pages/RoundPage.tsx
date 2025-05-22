import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchRoundDetails, tapGuss } from '../api/roundDetails';
import { logout as apiLogout } from '../api/auth';
import { useUserStore } from '../store/useUserStore';

interface RoundInfo {
    id: string;
    startAt: string;
    endAt: string;
    cooldownStart: string;
    status: 'cooldown' | 'active' | 'ended';
    totalScore: number;
    myScore: number;
    winner: null | { username: string; score: number };
}

export default function RoundPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [round, setRound] = useState<RoundInfo | null>(null);
    const [timeLeft, setTimeLeft] = useState<string>('');
    const { logout } = useUserStore();

    const updateTimer = (round: RoundInfo) => {
        const now = new Date();
        const start = new Date(round.startAt);
        const end = new Date(round.endAt);
        const time = round.status === 'cooldown' ? start : end;
        const diff = Math.max(0, time.getTime() - now.getTime());
        const seconds = Math.floor((diff / 1000) % 60);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    const load = async () => {
        const data = await fetchRoundDetails(id!) as RoundInfo;
        setRound(data);
        updateTimer(data);
    };

    const handleTap = async () => {
        const res = await tapGuss(id!) as { score: number };
        if (round) setRound({ ...round, myScore: res.score });
    };

    const handleLogout = async () => {
        await apiLogout();
        logout();
        navigate('/login');
    };

    useEffect(() => {
        load();
        const timer = setInterval(load, 1000);
        return () => clearInterval(timer);
    }, []);

    if (!round) return <div>Загрузка...</div>;

    return (
        <div style={{ textAlign: 'center', padding: 24 }}>
            <div className="header">
                <h2>Раунд {round.id}</h2>
                <button onClick={handleLogout}>Выйти</button>
            </div>

            <h3>
                {round.status === 'cooldown'
                    ? `⏳ Cooldown — до начала: ${timeLeft}`
                    : round.status === 'active'
                        ? `🔥 Активен — до конца: ${timeLeft}`
                        : '✅ Раунд завершён'}
            </h3>

            <div
                style={{
                    fontSize: 100,
                    margin: 32,
                    cursor: round.status === 'active' ? 'pointer' : 'default'
                }}
                onClick={round.status === 'active' ? handleTap : undefined}
            >
                🦆
            </div>

            <div style={{ fontSize: 20, marginBottom: 12 }}>Мои очки: {round.myScore}</div>

            {round.status === 'ended' && (
                <div style={{ marginTop: 24 }}>
                    <hr />
                    <div><strong>Победитель:</strong> {round.winner?.username || '—'}</div>
                    <div><strong>Очки победителя:</strong> {round.winner?.score ?? 0}</div>
                    <div><strong>Всего очков в раунде:</strong> {round.totalScore}</div>
                </div>
            )}
        </div>
    );
}
