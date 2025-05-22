import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { fetchMe } from './api/auth';
import { useUserStore } from './store/useUserStore';

fetchMe()
    .then(data => {
        useUserStore.getState().setUser(data);
    })
    .catch(() => {});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
