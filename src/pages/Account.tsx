import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetcher, formatCurrency } from '../lib/api';
import { useAuthStore } from '../lib/store';
import type { AuthState } from '../lib/store';
import { downloadInvoice } from '../lib/checkout';
import { Download } from 'lucide-react';

export default function Account() {
    const [user, setUser] = useState<{ id: number; email: string } | null>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [address, setAddress] = useState({ name: '', phone: '', city: '', state: '' });
    const [loading, setLoading] = useState(true);
    const token = useAuthStore((state: AuthState) => state.token);
    const setToken = useAuthStore((state: AuthState) => state.setToken);
    const navigate = useNavigate();

    const fetchUser = async () => {
        try {
            const data = await fetcher('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
            setUser(data.user);
            const orderData = await fetcher('/api/orders');
            setOrders(orderData.filter((order: any) => order.customer_email === data.user.email));
        } catch (err) {
            console.error('Auth error', err);
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchUser();
    }, [token]);

    const handleDownloadInvoice = async (order: any) => {
        try {
            // Fetch necessary relational data to reconstruct invoice
            const [
                details,
                companyDetails
            ] = await Promise.all([
                fetcher(`/api/order-details?order_id=${order.id}`),
                fetcher('/api/company')
            ]);

            const { items, address } = details;

            const mappedItems = items?.map((item: any) => ({
                name: item.products?.name || 'Unknown Item',
                quantity: item.quantity,
                price: item.price
            })) || [];

            const safeAddress = address || { name: order.customer_name, address_line: '', city: '' };
            const totals = {
                subtotal: Number(order.subtotal),
                discount: Number(order.discount),
                gst: Number(order.tax),
                shipping: Number(order.shipping),
                total: Number(order.total)
            };

            downloadInvoice({
                orderId: order.id,
                items: mappedItems,
                totals,
                address: safeAddress,
                companyDetails
            });
        } catch (err) {
            console.error("Error downloading invoice:", err);
            alert("Could not download invoice. Reference missing data.");
        }
    };

    if (loading) {
        return <div className="rounded-2xl border border-slate-200 bg-white p-8">Loading account...</div>;
    }

    return (
        <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-slate-900">Account</h2>
                <p className="mt-2 text-sm text-slate-500">{user?.email}</p>
                <div className="mt-6 space-y-3 text-sm text-slate-600">
                    <input
                        placeholder="Name"
                        value={address.name}
                        onChange={(event) => setAddress({ ...address, name: event.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-4 py-2"
                    />
                    <input
                        placeholder="Phone"
                        value={address.phone}
                        onChange={(event) => setAddress({ ...address, phone: event.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-4 py-2"
                    />
                    <input
                        placeholder="City"
                        value={address.city}
                        onChange={(event) => setAddress({ ...address, city: event.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-4 py-2"
                    />
                    <input
                        placeholder="State"
                        value={address.state}
                        onChange={(event) => setAddress({ ...address, state: event.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-4 py-2"
                    />
                    <button className="rounded-full border border-slate-200 px-4 py-2 text-sm">Save profile</button>
                </div>
                <button
                    onClick={async () => {
                        await fetcher('/api/auth/signout', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                            body: JSON.stringify({ token }),
                        });
                        setToken(null);
                        navigate('/login');
                    }}
                    className="mt-6 rounded-full border border-slate-200 px-4 py-2 text-sm"
                >
                    Sign out
                </button>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-slate-900">Order history</h2>
                <p className="mt-2 text-sm text-slate-500">View your recent orders and invoices.</p>
                <div className="mt-6 space-y-3 text-sm text-slate-600">
                    {orders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4">
                            <div>
                                <p className="font-semibold text-slate-900">Order #{order.id}</p>
                                <p className="text-xs text-slate-500">{order.status}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="font-semibold text-slate-900">{formatCurrency(Number(order.total))}</span>
                                <button
                                    onClick={() => handleDownloadInvoice(order)}
                                    className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                                >
                                    <Download size={14} /> Invoice
                                </button>
                            </div>
                        </div>
                    ))}
                    {orders.length === 0 && <p>No orders yet.</p>}
                </div>
            </div>
        </div>
    );
}
