import { useEffect, useMemo, useState } from 'react';
import { fetcher, formatCurrency } from '../lib/api';
import LoadingState from '../components/LoadingState';
import { BarChart3, TrendingUp, Package, Users, Calendar } from 'lucide-react';

export default function AdminReports() {
    const [orders, setOrders] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [ordersData, productsData] = await Promise.all([
                fetcher('/api/orders'),
                fetcher('/api/products')
            ]);
            setOrders(ordersData);
            setProducts(productsData);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const stats = useMemo(() => {
        const totalSales = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
        const totalOrders = orders.length;
        const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

        // Revenue by date
        const dateMap: Record<string, number> = {};
        orders.forEach((order) => {
            const date = new Date(order.created_at).toLocaleDateString('en-IN');
            dateMap[date] = (dateMap[date] || 0) + Number(order.total);
        });
        const dailyRevenue = Object.entries(dateMap).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());

        // Top products (mock distribution if items aren't directly in order object, but we'll try to find common ones)
        // Usually items are in order_items. For now we show basic counts if available or just list top 5 products by price as representative
        const topProducts = [...products].sort((a, b) => Number(b.base_price) - Number(a.base_price)).slice(0, 5);

        return { totalSales, totalOrders, avgOrderValue, dailyRevenue, topProducts };
    }, [orders, products]);

    if (loading) return <LoadingState label="Loading comprehensive reports" />;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Reports & Analytics</h1>
                <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-4 py-2 rounded-full border border-slate-200">
                    <Calendar size={16} />
                    <span>Real-time Data</span>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3 text-emerald-600 mb-2">
                        <TrendingUp size={20} />
                        <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">{formatCurrency(stats.totalSales)}</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3 text-blue-600 mb-2">
                        <BarChart3 size={20} />
                        <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">{stats.totalOrders}</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3 text-amber-600 mb-2">
                        <Users size={20} />
                        <span className="text-xs font-bold uppercase tracking-wider">Avg. Order Value</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">{formatCurrency(stats.avgOrderValue)}</div>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Revenue Breakdown */}
                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                    <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center gap-2">
                        <TrendingUp size={18} className="text-slate-400" />
                        <h2 className="font-bold text-slate-800">Revenue by Date</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        {stats.dailyRevenue.map(([date, total]) => {
                            const percentage = (total / (stats.totalSales || 1)) * 100;
                            return (
                                <div key={date} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-slate-700">{date}</span>
                                        <span className="font-bold text-slate-900">{formatCurrency(total)}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.max(percentage, 5)}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Top Products */}
                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                    <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center gap-2">
                        <Package size={18} className="text-slate-400" />
                        <h2 className="font-bold text-slate-800">Top Inventory Value</h2>
                    </div>
                    <div className="p-0">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase">
                                <tr>
                                    <th className="px-6 py-3">Product</th>
                                    <th className="px-6 py-3 text-right">Price</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {stats.topProducts.map(p => (
                                    <tr key={p.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium text-slate-700">{p.name}</td>
                                        <td className="px-6 py-4 text-right font-bold text-slate-900">{formatCurrency(p.base_price)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
