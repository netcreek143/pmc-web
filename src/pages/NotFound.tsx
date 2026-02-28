import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-16 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">404</p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900">Page not found</h1>
            <p className="mt-2 text-sm text-slate-500">Let’s get you back to premium packaging.</p>
            <Link to="/" className="mt-6 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white">
                Go home
            </Link>
        </div>
    );
}
