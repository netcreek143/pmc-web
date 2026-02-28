import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../lib/store';
import type { AuthState } from '../lib/store';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
    const token = useAuthStore((state: AuthState) => state.token);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
