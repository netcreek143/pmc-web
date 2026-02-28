import { useEffect, useMemo, useState } from 'react';
import { fetcher, formatCurrency } from '../lib/api';
import LoadingState from '../components/LoadingState';

export default function AdminReports() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        fetchData();
    }, []);

    const revenueByDate = useMemo(() => {
        const map: Record<string, number> = {};
        orders.forEach((order) => {
            const date = new Date(order.created_at).toLocaleDateString('en-IN');
            map[date] = (map[date] || 0) + Number(order.total);
        });
        return Object.entries(map);
    }, [orders]);

    if (loading) return <LoadingState label="Loading reports" />;

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <h1 className="text-2xl font-semibold text-slate-900">Reports & analytics</h1>
            <div className="mt-6 space-y-3 text-sm text-slate-600">
                {revenueByDate.map(([date, total]) => (
                    <div key={date} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3">
                        <span>{date}</span>
                        <span className="font-semibold">{formatCurrency(total)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
