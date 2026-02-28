import { useState } from 'react';
import { fetcher } from '../lib/api';

export default function BulkOrders() {
    const [form, setForm] = useState({ company: '', email: '', volume: '', category: '' });
    const [submitted, setSubmitted] = useState(false);

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        await fetcher('/api/inquiries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'bulk',
                status: 'new',
                name: form.company,
                email: form.email,
                company: form.company,
                message: `Volume: ${form.volume}. Category: ${form.category}`,
            }),
        });
        setSubmitted(true);
    };

    return (
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-8">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Bulk Orders</p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">Scale-ready packaging supply</h1>
                <p className="mt-4 text-sm text-slate-600">
                    Get automated MOQ pricing, scheduled dispatches, and dedicated account management for high volume orders.
                </p>
                <ul className="mt-6 space-y-2 text-sm text-slate-600">
                    <li>• MOQ planning and monthly contracts</li>
                    <li>• GST-ready invoices and bulk discount tiers</li>
                    <li>• Priority warehouse fulfillment</li>
                </ul>
            </div>
            <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-8">
                <h2 className="text-lg font-semibold text-slate-900">Request a bulk quote</h2>
                <div className="mt-4 space-y-3">
                    {['company', 'email', 'volume', 'category'].map((label) => (
                        <input
                            key={label}
                            placeholder={label.charAt(0).toUpperCase() + label.slice(1)}
                            value={(form as any)[label]}
                            onChange={(event) => setForm({ ...form, [label]: event.target.value })}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                        />
                    ))}
                </div>
                <button className="mt-6 w-full rounded-full bg-[color:var(--brand)] px-6 py-3 text-sm font-semibold text-white">
                    {submitted ? 'Submitted' : 'Submit'}
                </button>
            </form>
        </div>
    );
}
