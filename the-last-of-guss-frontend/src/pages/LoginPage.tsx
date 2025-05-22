import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, fetchMe } from '../api/auth';
import { useUserStore } from '../store/useUserStore';

export default function LoginPage() {
    const navigate = useNavigate();
    const { setUser } = useUserStore();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMe()
            .then(data => {
                setUser(data as { username: string; role: string });
                navigate('/rounds');
            })
            .catch(() => {});
    }, []);

    const handleLogin = async () => {
        try {
            await login(username, password);
            const data = await fetchMe() as { username: string; role: string };
            setUser(data);
            navigate('/rounds');
        } catch (e: any) {
            setError(e.response?.data?.error || 'Ошибка входа');
        }
    };

    return (
        <div className="form">
            <h2>ВОЙТИ</h2>

            <div className="form-group">
                <label>Имя пользователя:</label>
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Пароль:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            {error && (
                <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>
            )}

            <button onClick={handleLogin}>Войти</button>
        </div>
    );
}
