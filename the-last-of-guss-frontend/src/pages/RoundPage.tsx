import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchRoundDetails, tapGuss } from '../api/roundDetails';

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
    const [round, setRound] = useState<RoundInfo | null>(null);
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [intervalId, setIntervalId] = useState<number | null>(null);

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
        const data = await fetchRoundDetails(id!);
        setRound(data);
        updateTimer(data);
    };

    const handleTap = async () => {
        const res = await tapGuss(id!);
        if (round) setRound({ ...round, myScore: res.score });
    };

    useEffect(() => {
        load();

        const idInt = window.setInterval(() => {
            load();
        }, 1000);

        setIntervalId(idInt);

        return () => clearInterval(idInt);
    }, []);

    if (!round) return <div>Загрузка...</div>;

    const isActive = round.status === 'active';
    const isCooldown = round.status === 'cooldown';
    const isEnded = round.status === 'ended';

    return (
        <div style={{ textAlign: 'center', padding: 24 }}>
            <h2>Раунд {round.id}</h2>
            {isCooldown && <h3>⏳ Cooldown<br />до начала: {timeLeft}</h3>}
            {isActive && <h3>🔥 Раунд активен!<br />до конца: {timeLeft}</h3>}
            {isEnded && <h3>✅ Раунд завершён</h3>}

            <div style={{ fontSize: 100, margin: 32, cursor: isActive ? 'pointer' : 'default' }} onClick={isActive ? handleTap : undefined}>
                🦆
            </div>

            <div style={{ fontSize: 20, marginBottom: 12 }}>Мои очки: {round.myScore}</div>

            {isEnded && (
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
