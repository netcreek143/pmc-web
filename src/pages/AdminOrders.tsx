import { useEffect, useState } from 'react';
import { fetcher, formatCurrency } from '../lib/api';
import { useNotificationStore } from '../lib/notificationStore';
import LoadingState from '../components/LoadingState';
import Modal from '../components/Modal';
import { ShoppingCart, Eye, Clock, Truck, CheckCircle, XCircle, Loader2, Package, Printer } from 'lucide-react';

type Order = {
    id: number;
    customer_name: string;
    customer_email: string;
    status: string;
    total: number;
    created_at: string;
};

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);
    const [openInvoice, setOpenInvoice] = useState(false);
    const [selected, setSelected] = useState<Order | null>(null);
    const [details, setDetails] = useState<any>(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const showNotification = useNotificationStore(state => state.show);

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

    const fetchOrderDetails = async (orderId: number, view: 'details' | 'invoice') => {
        setDetailsLoading(true);
        try {
            const data = await fetcher(`/api/order-details?order_id=${orderId}`);
            setDetails(data);
            if (view === 'details') setOpenDetails(true);
            else setOpenInvoice(true);
        } catch (err) {
            alert('Failed to load order details');
        } finally {
            setDetailsLoading(false);
        }
    };

    const updateStatus = async (status: string) => {
        if (!selected) return;
        try {
            await fetcher('/api/orders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selected.id, status }),
            });
            showNotification(`Order #${selected.id} status updated to ${status}`, 'success');
            setOpenUpdate(false);
            fetchData();
        } catch (err) {
            showNotification('Failed to update status', 'error');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getStatusStyle = (status: string) => {
        const s = status.toLowerCase();
        if (s === 'delivered') return 'bg-emerald-100 text-emerald-700';
        if (s === 'cancelled') return 'bg-rose-100 text-rose-700';
        if (s === 'shipped') return 'bg-blue-100 text-blue-700';
        if (s === 'processing') return 'bg-amber-100 text-amber-700';
        return 'bg-slate-100 text-slate-700';
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <LoadingState label="Loading orders" />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-500">
                    <span className="text-[color:var(--brand)] font-medium">Home</span> /
                    <span className="text-slate-900">Order Management</span>
                </div>
            </div>

            <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden no-print">
                <div className="border-b border-slate-200 bg-[#eae6e1] px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ShoppingCart size={20} className="text-slate-800" />
                        <h2 className="text-lg font-bold text-slate-800">Sales Orders</h2>
                    </div>
                </div>

                <div className="p-0 overflow-x-auto">
                    <table className="w-full border-collapse text-xs text-left">
                        <thead className="bg-slate-50 text-slate-700 uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-3">Order ID</th>
                                <th className="px-6 py-3">Customer</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Total</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">No orders found</td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-900">#{order.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">{order.customer_name}</div>
                                            <div className="text-[10px] text-slate-400">{order.customer_email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-slate-900">
                                            {formatCurrency(Number(order.total))}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelected(order);
                                                        fetchOrderDetails(order.id, 'invoice');
                                                    }}
                                                    className="p-1.5 text-slate-400 hover:text-[color:var(--brand)] transition"
                                                    title="View Invoice"
                                                >
                                                    <Printer size={16} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelected(order);
                                                        fetchOrderDetails(order.id, 'details');
                                                    }}
                                                    className="p-1.5 text-slate-400 hover:text-slate-900 transition"
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelected(order);
                                                        setOpenUpdate(true);
                                                    }}
                                                    className="p-1.5 text-slate-400 hover:text-[color:var(--brand)] transition"
                                                    title="Update Status"
                                                >
                                                    <Clock size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Invoice Modal */}
            <Modal open={openInvoice} onClose={() => setOpenInvoice(false)} title="Tax Invoice" maxWidth="max-w-4xl">
                <div className="p-8 bg-white" id="printable-invoice">
                    <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 mb-1 tracking-tighter uppercase italic">PACK MY CAKE</h1>
                            <p className="text-xs text-slate-500 font-bold tracking-widest uppercase">Premium Packaging Solutions</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-2xl font-bold text-slate-900 uppercase">INVOICE</h2>
                            <p className="text-sm font-bold text-slate-600 tracking-tight">#{selected?.id}</p>
                            <p className="text-xs text-slate-400 mt-1">{new Date(selected?.created_at || '').toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-12 mb-12">
                        <div>
                            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-1">Billed By</h3>
                            <div className="text-xs space-y-1 font-bold text-slate-800">
                                <p className="text-sm font-black text-slate-900">PACK MY CAKE PVT LTD</p>
                                <p>Plot No. 42, Industrial Estate</p>
                                <p>Chennai, Tamil Nadu - 600032</p>
                                <p>GSTIN: 33AAAAA0000A1Z5</p>
                                <p>Email: billing@packmycake.in</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-1">Shipped To</h3>
                            <div className="text-xs space-y-1 font-bold text-slate-800">
                                <p className="text-sm font-black text-slate-900">{details?.address?.name}</p>
                                <p>{details?.address?.address_line}</p>
                                <p>{details?.address?.city}, {details?.address?.state} - {details?.address?.postal_code}</p>
                                <p>Ph: {details?.address?.phone}</p>
                                <p>Email: {details?.address?.email}</p>
                            </div>
                        </div>
                    </div>

                    <table className="w-full mb-8">
                        <thead>
                            <tr className="bg-slate-900 text-white uppercase text-[10px] font-black tracking-widest">
                                <th className="px-4 py-3 text-left">Description</th>
                                <th className="px-4 py-3 text-right">Price</th>
                                <th className="px-4 py-3 text-right">Qty</th>
                                <th className="px-4 py-3 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 border-b border-slate-100">
                            {details?.items?.map((item: any) => (
                                <tr key={item.id} className="text-xs text-slate-800 font-bold">
                                    <td className="px-4 py-4 uppercase tracking-tight">{item.products?.name}</td>
                                    <td className="px-4 py-4 text-right">{formatCurrency(Number(item.price))}</td>
                                    <td className="px-4 py-4 text-right">{item.quantity}</td>
                                    <td className="px-4 py-4 text-right font-black">{formatCurrency(item.quantity * Number(item.price))}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-end">
                        <div className="w-64 space-y-2">
                            <div className="flex justify-between text-xs font-bold text-slate-500">
                                <span>Subtotal</span>
                                <span>{formatCurrency(Number(selected?.total || 0))}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold text-slate-500">
                                <span>Shipping</span>
                                <span>₹0.00</span>
                            </div>
                            <div className="flex justify-between text-lg font-black text-slate-900 border-t-2 border-slate-900 pt-2 mt-2 uppercase italic tracking-tighter">
                                <span>Total Paid</span>
                                <span>{formatCurrency(Number(selected?.total || 0))}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 pt-8 border-t border-slate-100 text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Authorized Signatory</p>
                        <div className="h-12"></div>
                        <p className="text-[10px] text-slate-300">This is a system generated invoice. No signature required.</p>
                    </div>
                </div>
                <div className="flex justify-end gap-3 p-6 border-t border-slate-50 no-print">
                    <button onClick={handlePrint} className="flex items-center gap-2 rounded bg-slate-900 px-6 py-2 text-xs font-black text-white uppercase tracking-widest hover:bg-slate-800 transition shadow-lg shadow-slate-200">
                        <Printer size={14} /> Print Invoice
                    </button>
                    <button onClick={() => setOpenInvoice(false)} className="rounded border border-slate-200 px-6 py-2 text-xs font-bold text-slate-500 uppercase tracking-widest hover:bg-slate-50 transition">
                        Close
                    </button>
                </div>
            </Modal>

            {/* Status Update Modal */}
            <Modal open={openUpdate} onClose={() => setOpenUpdate(false)} title="Update Order Status">
                <div className="space-y-4 p-4 text-center">
                    <p className="text-xs text-slate-500">Select new status for Order #{selected?.id}</p>
                    <div className="grid grid-cols-1 gap-2">
                        {[
                            { label: 'Pending', icon: <Clock size={14} />, color: 'hover:bg-slate-50' },
                            { label: 'Processing', icon: <Package size={14} />, color: 'hover:bg-amber-50' },
                            { label: 'Shipped', icon: <Truck size={14} />, color: 'hover:bg-blue-50' },
                            { label: 'Delivered', icon: <CheckCircle size={14} />, color: 'hover:bg-emerald-50' },
                            { label: 'Cancelled', icon: <XCircle size={14} />, color: 'hover:bg-rose-50' }
                        ].map((s) => (
                            <button
                                key={s.label}
                                onClick={() => updateStatus(s.label)}
                                className={`flex items-center justify-center gap-2 w-full rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-700 transition ${s.color}`}
                            >
                                {s.icon} {s.label}
                            </button>
                        ))}
                    </div>
                </div>
            </Modal>

            {/* Order Details Modal */}
            <Modal open={openDetails} onClose={() => setOpenDetails(false)} title={`Order Details`}>
                <div className="space-y-6 max-h-[80vh] overflow-y-auto p-4 text-xs">
                    {details && (
                        <>
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                                <div>
                                    <h4 className="font-bold text-slate-400 uppercase tracking-tighter mb-2">Shipping Address</h4>
                                    <div className="text-slate-900 space-y-0.5">
                                        <p className="font-bold">{details.address?.name}</p>
                                        <p>{details.address?.address_line}</p>
                                        <p>{details.address?.city}, {details.address?.state}</p>
                                        <p>{details.address?.postal_code}</p>
                                        <p className="pt-1 text-slate-500">{details.address?.phone}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <h4 className="font-bold text-slate-400 uppercase tracking-tighter mb-2">Order Info</h4>
                                    <p className="font-bold text-slate-900 text-base">#{selected?.id}</p>
                                    <p className="text-slate-500">{new Date(selected?.created_at || '').toLocaleString()}</p>
                                    <span className={`mt-2 inline-block px-2 py-0.5 rounded-full font-bold uppercase ${getStatusStyle(selected?.status || '')}`}>
                                        {selected?.status}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-slate-400 uppercase tracking-tighter mb-3">Order Items</h4>
                                <div className="space-y-3">
                                    {details.items?.map((item: any) => (
                                        <div key={item.id} className="flex items-center justify-between border-b border-slate-50 pb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-slate-100 rounded flex items-center justify-center">
                                                    <Package size={20} className="text-slate-300" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{item.products?.name}</p>
                                                    <p className="text-slate-400">Qty: {item.quantity} × {formatCurrency(Number(item.price))}</p>
                                                </div>
                                            </div>
                                            <p className="font-bold text-slate-900">{formatCurrency(item.quantity * Number(item.price))}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <div className="flex justify-between items-center text-base font-bold text-slate-900">
                                    <span>Total Amount</span>
                                    <span>{formatCurrency(Number(selected?.total || 0))}</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </Modal>

            {detailsLoading && (
                <div className="fixed inset-0 bg-white/20 backdrop-blur-[1px] flex items-center justify-center z-[100]">
                    <Loader2 className="animate-spin text-slate-400" size={32} />
                </div>
            )}

            <style>{`
                @media print {
                    .no-print, nav, header { display: none !important; }
                    body { background: white !important; margin: 0; padding: 0; }
                    #printable-invoice { width: 100% !important; border: none !important; box-shadow: none !important; }
                    .flex-1 { overflow: visible !important; }
                }
            `}</style>
        </div>
    );
}
