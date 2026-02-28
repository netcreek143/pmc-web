import { useEffect, useState } from 'react';
import { fetcher } from '../lib/api';
import LoadingState from '../components/LoadingState';

export default function Contact() {
    const [data, setData] = useState<{ title: string; content: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const fetchContent = async () => {
        try {
            const cms = await fetcher('/api/cms-content');
            setData(cms.find((item: any) => item.key === 'contact'));
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const submitForm = async (event: React.FormEvent) => {
        event.preventDefault();
        await fetcher('/api/inquiries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'contact', status: 'new', ...form }),
        });
        setSubmitted(true);
    };

    useEffect(() => {
        fetchContent();
    }, []);

    if (loading) return <LoadingState label="Loading contact" />;
    if (!data) return null;

    return (
        <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-8">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Contact</p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">{data.title}</h1>
                <p className="mt-4 text-sm text-slate-600">{data.content}</p>
                <div className="mt-6 space-y-2 text-sm text-slate-600">
                    <p>Sales: +91 88888 11111</p>
                    <p>Warehouse: Mumbai, India</p>
                </div>
                <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
                    <p className="font-semibold text-slate-900">FAQ</p>
                    <p className="mt-2">Minimum order quantity is 10 units. Free shipping above ₹999.</p>
                </div>
            </div>
            <form onSubmit={submitForm} className="rounded-3xl border border-slate-200 bg-white p-8">
                <h2 className="text-lg font-semibold text-slate-900">Send a message</h2>
                <div className="mt-4 space-y-3">
                    {['name', 'email', 'company'].map((key) => (
                        <input
                            key={key}
                            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                            value={(form as any)[key]}
                            onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                        />
                    ))}
                    <textarea
                        placeholder="Message"
                        value={form.message}
                        onChange={(event) => setForm({ ...form, message: event.target.value })}
                        className="h-28 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                    />
                </div>
                <button className="mt-6 w-full rounded-full bg-[color:var(--brand)] px-6 py-3 text-sm font-semibold text-white">
                    {submitted ? 'Submitted' : 'Submit'}
                </button>
            </form>
        </div>
    );
}
