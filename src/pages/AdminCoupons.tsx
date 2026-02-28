import { useEffect, useState } from 'react';
import { fetcher } from '../lib/api';
import LoadingState from '../components/LoadingState';
import Modal from '../components/Modal';

const emptyCoupon = {
    code: '',
    discount_type: 'percentage',
    value: 0,
    min_order_amount: 0,
    expires_at: '',
};

export default function AdminCoupons() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<any>(emptyCoupon);

    const fetchData = async () => {
        try {
            const data = await fetcher('/api/coupons');
            setCoupons(data);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const saveCoupon = async () => {
        await fetcher('/api/coupons', {
            method: form.id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });
        setOpen(false);
        setForm(emptyCoupon);
        fetchData();
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <LoadingState label="Loading coupons" />;

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-slate-900">Coupon management</h1>
                <button
                    onClick={() => setOpen(true)}
                    className="rounded-full bg-[color:var(--brand)] px-4 py-2 text-sm text-white"
                >
                    Add coupon
                </button>
            </div>
            <div className="mt-6 space-y-3 text-sm text-slate-600">
                {coupons.map((coupon) => (
                    <div key={coupon.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3">
                        <div>
                            <p className="font-semibold text-slate-900">{coupon.code}</p>
                            <p className="text-xs text-slate-500">{coupon.discount_type} · min {coupon.min_order_amount}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-slate-500">Expires {new Date(coupon.expires_at).toDateString()}</span>
                            <button
                                onClick={() => {
                                    setForm(coupon);
                                    setOpen(true);
                                }}
                                className="text-xs text-slate-500"
                            >
                                Edit
                            </button>
                            <button
                                onClick={async () => {
                                    await fetcher('/api/coupons', {
                                        method: 'DELETE',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ id: coupon.id }),
                                    });
                                    fetchData();
                                }}
                                className="text-xs text-rose-500"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <Modal open={open} onClose={() => setOpen(false)} title="Coupon">
                <div className="space-y-3 text-sm">
                    {['code', 'discount_type', 'expires_at'].map((field) => (
                        <input
                            key={field}
                            placeholder={field.replace('_', ' ')}
                            value={form[field] || ''}
                            onChange={(event) => setForm({ ...form, [field]: event.target.value })}
                            className="w-full rounded-xl border border-slate-200 px-4 py-2"
                        />
                    ))}
                    {['value', 'min_order_amount'].map((field) => (
                        <input
                            key={field}
                            type="number"
                            placeholder={field.replace('_', ' ')}
                            value={form[field] || 0}
                            onChange={(event) => setForm({ ...form, [field]: Number(event.target.value) })}
                            className="w-full rounded-xl border border-slate-200 px-4 py-2"
                        />
                    ))}
                    <button onClick={saveCoupon} className="w-full rounded-full bg-[color:var(--brand)] px-4 py-2 text-white">
                        Save
                    </button>
                </div>
            </Modal>
        </div>
    );
}
