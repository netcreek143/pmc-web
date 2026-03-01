import { useEffect, useState } from 'react';
import { Package, TrendingUp, ShoppingCart, AlertTriangle } from 'lucide-react';
import { fetcher, formatCurrency } from '../lib/api';
import LoadingState from '../components/LoadingState';
import StatsCard from '../components/StatsCard';

type Product = { id: number; name: string; stock: number; low_stock_threshold: number; sale_price: number; price: number };

type Order = { id: number; status: string; total: number; created_at: string; customer_name: string };

type Customer = { id: number; name: string; total_spend: number };

export default function AdminDashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [productData, orderData, customerData, statsData] = await Promise.all([
                fetcher('/api/products'),
                fetcher('/api/orders'),
                fetcher('/api/customers'),
                fetcher('/api/admin-stats'),
            ]);
            setProducts(productData);
            setOrders(orderData);
            setCustomers(customerData);
            setStats(statsData);
        } catch (err) {
            console.error('[Dashboard] Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <LoadingState label="Loading dashboard" />;

    return (
        <div className="space-y-8">
            <header>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Admin</p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">Dashboard Overview</h1>
            </header>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard label="Total revenue" value={formatCurrency(stats?.totalRevenue || 0)} icon={<TrendingUp size={20} />} />
                <StatsCard label="Orders today" value={`${stats?.ordersToday || 0}`} icon={<ShoppingCart size={20} />} />
                <StatsCard label="Active products" value={`${stats?.productCount || 0}`} icon={<Package size={20} />} />
                <StatsCard label="Low stock alerts" value={`${stats?.lowStock || 0}`} icon={<AlertTriangle size={20} />} />
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-white p-6">
                    <h2 className="text-lg font-semibold text-slate-900">Recent orders</h2>
                    <div className="mt-4 space-y-3 text-sm text-slate-600">
                        {orders.slice(0, 5).map((order) => (
                            <div key={order.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3">
                                <div>
                                    <p className="font-semibold text-slate-900">#{order.id} · {order.customer_name}</p>
                                    <p className="text-xs text-slate-500">{new Date(order.created_at).toDateString()}</p>
                                </div>
                                <span className="text-sm font-semibold">{formatCurrency(Number(order.total))}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-6">
                    <h2 className="text-lg font-semibold text-slate-900">Top customers</h2>
                    <div className="mt-4 space-y-3 text-sm text-slate-600">
                        {customers.slice(0, 5).map((customer) => (
                            <div key={customer.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3">
                                <div>
                                    <p className="font-semibold text-slate-900">{customer.name}</p>
                                    <p className="text-xs text-slate-500">Total spend</p>
                                </div>
                                <span className="text-sm font-semibold">{formatCurrency(Number(customer.total_spend || 0))}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-slate-900">Low stock alerts</h2>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                    {products
                        .filter((product) => product.stock <= product.low_stock_threshold)
                        .map((product) => (
                            <div key={product.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-rose-50 p-3">
                                <span>{product.name}</span>
                                <span className="text-rose-500">{product.stock} left</span>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}
