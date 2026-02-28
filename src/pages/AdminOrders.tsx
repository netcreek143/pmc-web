import { useEffect, useState } from 'react';
import { fetcher, formatCurrency } from '../lib/api';
import LoadingState from '../components/LoadingState';
import Modal from '../components/Modal';

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);

    const fetchData = async () => {
        try {
            const data = await fetcher('/api/orders');
            setOrders(data);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (status: string) => {
        await fetcher('/api/orders', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: selected.id, status }),
        });
        setOpen(false);
        fetchData();
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <LoadingState label="Loading orders" />;

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <h1 className="text-2xl font-semibold text-slate-900">Order management</h1>
            <div className="mt-6 space-y-3 text-sm text-slate-600">
                {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3">
                        <div>
                            <p className="font-semibold text-slate-900">#{order.id} · {order.customer_name}</p>
                            <p className="text-xs text-slate-500">{order.status}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span>{formatCurrency(Number(order.total))}</span>
                            <button
                                onClick={() => {
                                    setSelected(order);
                                    setOpen(true);
                                }}
                                className="text-xs text-slate-500"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <Modal open={open} onClose={() => setOpen(false)} title="Update order status">
                <div className="space-y-2">
                    {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => updateStatus(status)}
                            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600"
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </Modal>
        </div>
    );
}
