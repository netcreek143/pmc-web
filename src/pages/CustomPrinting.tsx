import { useState } from 'react';
import { fetcher } from '../lib/api';

export default function CustomPrinting() {
    const [form, setForm] = useState({ brandName: '', email: '', type: '', timeline: '' });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await fetcher('/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'custom',
                    status: 'new',
                    name: form.brandName,
                    email: form.email,
                    company: form.brandName,
                    message: `Type: ${form.type}. Timeline: ${form.timeline}`,
                }),
            });
            setSubmitted(true);
        } catch (err) {
            alert('Failed to send request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-8">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Custom Printing</p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">Make every box your brand ambassador</h1>
                <p className="mt-4 text-sm text-slate-600">
                    Share your logo, finishes, and embossing preferences. Our design team will respond with a custom quote.
                </p>
                <ul className="mt-6 space-y-2 text-sm text-slate-600">
                    <li>• Foil stamping and soft-touch lamination</li>
                    <li>• Window cutouts and premium inserts</li>
                    <li>• Pantone matched pastel palettes</li>
                </ul>
            </div>
            <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-8">
                <h2 className="text-lg font-semibold text-slate-900">Start your custom inquiry</h2>
                <div className="mt-4 space-y-3">
                    <input
                        placeholder="Brand name"
                        value={form.brandName}
                        onChange={e => setForm({ ...form, brandName: e.target.value })}
                        required
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        required
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                    />
                    <input
                        placeholder="Packaging type (e.g. Cake box)"
                        value={form.type}
                        onChange={e => setForm({ ...form, type: e.target.value })}
                        required
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                    />
                    <input
                        placeholder="Timeline (e.g. 2 weeks)"
                        value={form.timeline}
                        onChange={e => setForm({ ...form, timeline: e.target.value })}
                        required
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading || submitted}
                    className="mt-6 w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                    {submitted ? 'Request Sent' : loading ? 'Sending...' : 'Send request'}
                </button>
            </form>
        </div>
    );
}
