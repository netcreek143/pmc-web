import { useState, useEffect } from 'react';
import { Calendar, Mail, CheckCircle, Loader2, Monitor } from 'lucide-react';
import { fetcher } from '../lib/api';

type Inquiry = {
    id: number;
    type: string;
    status: string;
    name: string;
    email: string;
    company?: string;
    message: string;
    created_at: string;
};

export default function AdminCustomize() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await fetcher('/api/inquiries');
            setInquiries(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStatusUpdate = async (id: number, status: string) => {
        try {
            await fetcher('/api/inquiries', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status }),
            });
            fetchData();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="text-[color:var(--brand)] font-medium">Home</span> /
                <span className="text-slate-900">Customization Enquiries</span>
            </div>

            <div className="rounded-lg bg-white shadow-sm border border-slate-200 overflow-hidden">
                <div className="border-b border-slate-200 bg-[#eae6e1] px-6 py-4 flex items-center gap-2">
                    <Monitor size={20} className="text-slate-800" />
                    <h2 className="text-lg font-bold text-slate-800">Customization Requests</h2>
                </div>

                <div className="p-0">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 size={24} className="animate-spin text-slate-300" />
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-700 uppercase font-semibold">
                                    <tr>
                                        <th className="px-6 py-3">Customer</th>
                                        <th className="px-6 py-3">Contact</th>
                                        <th className="px-6 py-3">Message</th>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {inquiries.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">No enquiries yet</td>
                                        </tr>
                                    ) : (
                                        inquiries.map((inq) => (
                                            <tr key={inq.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 align-top">
                                                    <div className="font-bold text-slate-900">{inq.name}</div>
                                                    <div className="text-[10px] text-slate-500">{inq.company || 'Individual'}</div>
                                                    <span className={`mt-2 inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${inq.status === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                                                        }`}>
                                                        {inq.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 align-top space-y-1">
                                                    <div className="flex items-center gap-1.5 text-slate-600">
                                                        <Mail size={12} className="text-slate-400" /> {inq.email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 align-top">
                                                    <p className="max-w-xs text-slate-600 whitespace-pre-wrap">{inq.message}</p>
                                                </td>
                                                <td className="px-6 py-4 align-top text-slate-400">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar size={12} /> {new Date(inq.created_at).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 align-top text-right">
                                                    {inq.status === 'new' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(inq.id, 'read')}
                                                            className="text-slate-400 hover:text-emerald-600 transition"
                                                            title="Mark as Read"
                                                        >
                                                            <CheckCircle size={18} />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
