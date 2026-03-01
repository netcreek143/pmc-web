import { useEffect, useState } from 'react';
import { Download, Flame, Search } from 'lucide-react';
import { fetcher } from '../lib/api';
import LoadingState from '../components/LoadingState';

export default function AdminCampaign() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

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

    useEffect(() => {
        fetchData();
    }, []);

    const filteredCustomers = customers.filter(c =>
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const downloadCSV = () => {
        if (filteredCustomers.length === 0) return;

        const headers = ['#', 'Name', 'Email', 'Contact', 'Address', 'Join Date'];
        const csvRows = [
            headers.join(','),
            ...filteredCustomers.map((c, idx) => [
                idx + 1,
                `"${c.name || ''}"`,
                `"${c.email || ''}"`,
                `"${c.phone || ''}"`,
                `"${c.address || ''}"`,
                `"${new Date(c.created_at).toLocaleDateString()}"`
            ].join(','))
        ];

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `customers_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <LoadingState label="Loading campaigns data" />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="text-[color:var(--brand)] font-medium">Home</span>
                    <span>/</span>
                    <span className="text-slate-900 font-medium">Campaign</span>
                </div>
                <button
                    onClick={downloadCSV}
                    disabled={filteredCustomers.length === 0}
                    className="flex items-center gap-2 rounded bg-[#1e4438] px-4 py-2 text-sm font-medium text-white hover:bg-[#153128] transition-colors disabled:opacity-50"
                >
                    <Download size={16} />
                    Download Excel
                </button>
            </div>

            {/* Main Card */}
            <div className="rounded-lg bg-white shadow-sm border border-slate-100 overflow-hidden">
                <div className="border-b border-slate-200 bg-[#ebe9e1] px-6 py-4 flex items-center gap-2">
                    <Flame size={20} className="text-slate-800" />
                    <h2 className="text-lg font-bold text-slate-800">Customer Campaigns</h2>
                </div>

                <div className="p-4">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search name, email, phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded border border-slate-300 pl-10 pr-4 py-2.5 text-sm focus:border-brand focus:outline-none transition-all"
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-slate-100 text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="border-b border-slate-200 px-4 py-3 text-left font-bold text-slate-700">#</th>
                                    <th className="border-b border-slate-200 px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider text-[11px]">Name</th>
                                    <th className="border-b border-slate-200 px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider text-[11px]">Email</th>
                                    <th className="border-b border-slate-200 px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider text-[11px]">Contact</th>
                                    <th className="border-b border-slate-200 px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider text-[11px]">Join Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredCustomers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-12 text-center text-slate-400 font-medium">No results found</td>
                                    </tr>
                                ) : (
                                    filteredCustomers.map((row, idx) => (
                                        <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-4 text-slate-400 font-medium">{idx + 1}</td>
                                            <td className="px-4 py-4 font-bold text-slate-900">{row.name}</td>
                                            <td className="px-4 py-4 text-slate-600">{row.email}</td>
                                            <td className="px-4 py-4 text-slate-600">{row.phone || '-'}</td>
                                            <td className="px-4 py-4 text-slate-400 text-xs">
                                                {new Date(row.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
