import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RoundsPage from './pages/RoundsPage';
import RoundPage from './pages/RoundPage';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/rounds" element={<RoundsPage />} />
                <Route path="/round/:id" element={<RoundPage />} />
            </Routes>
        </BrowserRouter>
    );
}
