import { useState, useEffect } from 'react';
import { Star, CheckCircle, Trash2, Loader2, MessageSquare } from 'lucide-react';
import { fetcher } from '../lib/api';

type Review = {
    id: number;
    product_id: number;
    customer_name: string;
    rating: number;
    comment: string;
    status: string;
    created_at: string;
};

export default function AdminReviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const data = await fetcher('/api/reviews');
            setReviews(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateStatus = async (id: number, status: string) => {
        try {
            await fetcher('/api/reviews', {
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
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-500">
                    <span className="text-[color:var(--brand)] font-medium">Home</span> /
                    <span className="text-slate-900">Reviews</span>
                </div>
            </div>

            <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-slate-200 bg-[#eae6e1] px-6 py-4 flex items-center gap-2">
                    <MessageSquare size={20} className="text-slate-800" />
                    <h2 className="text-lg font-bold text-slate-800">Customer Reviews</h2>
                </div>

                <div className="p-0 overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 size={24} className="animate-spin text-slate-300" />
                        </div>
                    ) : (
                        <table className="w-full border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-3 text-left font-semibold text-slate-700 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left font-semibold text-slate-700 uppercase tracking-wider">Rating</th>
                                    <th className="px-6 py-3 text-left font-semibold text-slate-700 uppercase tracking-wider">Comment</th>
                                    <th className="px-6 py-3 text-left font-semibold text-slate-700 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right font-semibold text-slate-700 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {reviews.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">No reviews found</td>
                                    </tr>
                                ) : (
                                    reviews.map((r) => (
                                        <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-slate-900">{r.customer_name}</div>
                                                <div className="text-[10px] text-slate-400">{new Date(r.created_at).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-0.5 text-amber-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={12} fill={i < r.rating ? 'currentColor' : 'none'} />
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 max-w-xs">{r.comment}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${r.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {r.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {r.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(r.id, 'approved')}
                                                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded"
                                                            title="Approve Review"
                                                        >
                                                            <CheckCircle size={16} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => { if (confirm('Delete review?')) handleUpdateStatus(r.id, 'deleted') }}
                                                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                                                        title="Delete Review"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
