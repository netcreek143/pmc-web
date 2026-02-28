import { useState } from 'react';
import { fetcher, formatCurrency } from '../lib/api';

export default function OrderTracking() {
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [order, setOrder] = useState<any>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const trackOrder = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        setOrder(null);
        if (!orderId || !email) {
            setError('Please enter both an order ID and email.');
            return;
        }
        setLoading(true);
        try {
            const data = await fetcher('/api/orders');
            const found = data.find(
                (o: any) =>
                    String(o.id) === orderId.trim() &&
                    o.customer_email?.toLowerCase() === email.trim().toLowerCase()
            );
            if (found) {
                setOrder(found);
            } else {
                setError('No order found matching that ID and email address.');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch orders.');
        } finally {
            setLoading(false);
        }
    };

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-700',
        confirmed: 'bg-blue-100 text-blue-700',
        dispatched: 'bg-indigo-100 text-indigo-700',
        delivered: 'bg-green-100 text-green-700',
        cancelled: 'bg-rose-100 text-rose-600',
    };

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-8">
                <h1 className="text-2xl font-semibold text-slate-900">Track your order</h1>
                <p className="mt-2 text-sm text-slate-500">Enter your order ID and email to get live tracking updates.</p>
                <form onSubmit={trackOrder} className="mt-6 space-y-4">
                    <input
                        placeholder="Order ID"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                    />
                    <input
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
                    >
                        {loading ? 'Searching…' : 'Track order'}
                    </button>
                </form>
                {error && <p className="mt-4 text-sm text-rose-500">{error}</p>}
            </div>

            {order && (
                <div className="rounded-3xl border border-slate-200 bg-white p-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">Order</p>
                            <p className="text-xl font-semibold text-slate-900">#{order.id}</p>
                        </div>
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusColors[order.status] ?? 'bg-slate-100 text-slate-600'}`}
                        >
                            {order.status}
                        </span>
                    </div>
                    <div className="mt-6 space-y-2 text-sm text-slate-600">
                        <div className="flex justify-between">
                            <span>Customer</span>
                            <span className="font-medium text-slate-900">{order.customer_name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Total</span>
                            <span className="font-semibold text-slate-900">{formatCurrency(Number(order.total))}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Placed on</span>
                            <span>{new Date(order.created_at).toDateString()}</span>
                        </div>
                        {order.payment_method && (
                            <div className="flex justify-between">
                                <span>Payment</span>
                                <span>{order.payment_method}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

