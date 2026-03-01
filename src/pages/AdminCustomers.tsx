import { useEffect, useState } from 'react';
import { fetcher, formatCurrency } from '../lib/api';
import LoadingState from '../components/LoadingState';
import { User, Mail, Phone, Tag, DollarSign, X, Pencil, Search, Loader2 } from 'lucide-react';
import { useNotificationStore } from '../lib/notificationStore';

export default function AdminCustomers() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const showNotification = useNotificationStore(state => state.show);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await fetcher('/api/customers');
            setCustomers(data);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        setSaving(true);
        try {
            await fetcher('/api/customers', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedCustomer),
            });
            showNotification('Customer profile updated', 'success');
            setModalOpen(false);
            fetchData();
        } catch (err) {
            showNotification('Failed to update customer', 'error');
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <LoadingState label="Loading customers" />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Customer Management</h1>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            const headers = ['Name', 'Customer Type', 'Email', 'Phone', 'Total Spend'];
                            const rows = customers.map(c => [
                                c.name,
                                c.customer_type || 'B2C',
                                c.email || '',
                                c.phone || '',
                                c.total_spend || 0
                            ]);
                            const csvContent = "data:text/csv;charset=utf-8,"
                                + headers.join(",") + "\n"
                                + rows.map(e => e.join(",")).join("\n");
                            const encodedUri = encodeURI(csvContent);
                            const link = document.createElement("a");
                            link.setAttribute("href", encodedUri);
                            link.setAttribute("download", `customers_${new Date().toISOString().split('T')[0]}.csv`);
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-bold hover:bg-slate-200 transition border border-slate-200"
                    >
                        <Search size={16} className="rotate-90" /> Export Excel
                    </button>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search customers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 rounded-full border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)] w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Contact</th>
                            <th className="px-6 py-4">Total Spend</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredCustomers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">No customers found</td>
                            </tr>
                        ) : (
                            filteredCustomers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                <User size={20} />
                                            </div>
                                            <div className="font-semibold text-slate-900">{customer.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${customer.customer_type === 'B2B' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                            {customer.customer_type || 'B2C'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        <div className="flex flex-col gap-0.5">
                                            <div className="flex items-center gap-1.5"><Mail size={12} /> {customer.email}</div>
                                            {customer.phone && <div className="flex items-center gap-1.5"><Phone size={12} /> {customer.phone}</div>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-900">
                                        {formatCurrency(Number(customer.total_spend || 0))}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => {
                                                setSelectedCustomer(customer);
                                                setModalOpen(true);
                                            }}
                                            className="p-2 text-slate-400 hover:text-[color:var(--brand)] hover:bg-slate-100 rounded-full transition"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {modalOpen && selectedCustomer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-bold text-slate-800">Edit Customer Profile</h3>
                            <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                    <input
                                        type="text"
                                        value={selectedCustomer.name}
                                        onChange={(e) => setSelectedCustomer({ ...selectedCustomer, name: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase">Customer Type</label>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                    <select
                                        value={selectedCustomer.customer_type}
                                        onChange={(e) => setSelectedCustomer({ ...selectedCustomer, customer_type: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)] appearance-none bg-white font-medium"
                                    >
                                        <option value="B2C">B2C (Individual)</option>
                                        <option value="B2B">B2B (Business)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase">Spend Adjustment</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                    <input
                                        type="number"
                                        value={selectedCustomer.total_spend}
                                        onChange={(e) => setSelectedCustomer({ ...selectedCustomer, total_spend: Number(e.target.value) })}
                                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                disabled={saving}
                                className="px-6 py-2 bg-[color:var(--brand)] text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-900/10 hover:opacity-90 disabled:opacity-50 transition flex items-center gap-2"
                            >
                                {saving && <Loader2 size={14} className="animate-spin" />}
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
