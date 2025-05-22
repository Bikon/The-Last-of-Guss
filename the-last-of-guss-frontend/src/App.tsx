import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RoundsPage from './pages/RoundsPage';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/rounds" element={<RoundsPage />} />
                {/* /round/:id */}
            </Routes>
        </BrowserRouter>
    );
}
