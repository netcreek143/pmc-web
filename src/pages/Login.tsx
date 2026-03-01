import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetcher } from '../lib/api';
import { useAuthStore } from '../lib/store';
import type { AuthState } from '../lib/store';

export default function Login() {
    const [email, setEmail] = useState('demo@packmycake.in');
    const [password, setPassword] = useState('password123');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const setToken = useAuthStore((state: AuthState) => state.setToken);

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const data = await fetcher('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            setToken(data.token, data.user);
            navigate('/admin');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8">
            <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
            <p className="mt-2 text-sm text-slate-500">Use the demo credentials to access your account.</p>
            {error && <p className="mt-4 text-sm text-rose-500">{error}</p>}
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
                <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                    placeholder="Email or Username"
                    type="text"
                />
                <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                    placeholder="Password"
                    type="password"
                />
                <button
                    className="w-full rounded-full bg-[color:var(--brand)] px-6 py-3 text-sm font-semibold text-white"
                    type="submit"
                >
                    Login
                </button>
            </form>
        </div>
    );
}
