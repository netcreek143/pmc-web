import { MonitorSmartphone, EyeOff, Send, PlusSquare, Loader2, Trash2, CheckCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetcher } from '../lib/api';
import { useNotificationStore } from '../lib/notificationStore';

type Category = {
    id: number;
    name: string;
    image_url?: string;
    status: string;
};

export default function AdminCategory() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteResult, setDeleteResult] = useState<'success' | 'error' | null>(null);
    const showNotification = useNotificationStore(state => state.show);

    const fetchCategories = async () => {
        try {
            const data = await fetcher('/api/categories');
            setCategories(data);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        setSubmitting(true);
        try {
            await fetcher('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCategoryName }),
            });
            showNotification('Category added successfully', 'success');
            setNewCategoryName('');
            fetchCategories();
        } catch (err) {
            console.error(err);
            showNotification('Failed to add category', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        setDeleteResult(null);
        try {
            await fetcher('/api/categories', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: deleteId }),
            });
            setDeleteResult('success');
            fetchCategories();
        } catch (err) {
            console.error(err);
            setDeleteResult('error');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-500">
                    <span className="text-[color:var(--brand)] font-medium">Home</span> /
                    <span>Settings</span> /
                    <span className="text-slate-900">Category</span>
                </div>
                <button className="flex items-center gap-2 rounded bg-[#e87c48] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#d46a39]">
                    <EyeOff size={14} /> View category & Subcategory
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Add Category */}
                <div className="rounded-md border border-slate-200 bg-white shadow-sm h-fit">
                    <div className="flex items-center gap-2 border-b border-slate-200 bg-[#eae6e1] px-6 py-4 rounded-t-md text-slate-900 font-bold text-base">
                        <MonitorSmartphone size={20} /> Add Category
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="space-y-1.5">
                            <label className="font-semibold text-slate-700 text-[11px]">New Category Name</label>
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="Enter category name"
                                className="w-full rounded border border-slate-200 px-3 py-2 text-xs focus:ring-1 focus:ring-slate-300 outline-none"
                                required
                            />
                        </div>

                        <div className="pt-2 flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex items-center gap-2 rounded bg-[#20403e] px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-[#1a3331] disabled:opacity-50"
                            >
                                {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                Submit
                            </button>
                        </div>
                    </form>
                </div>

                {/* Categories List */}
                <div className="rounded-md border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center gap-2 border-b border-slate-200 bg-[#eae6e1] px-6 py-4 rounded-t-md text-slate-900 font-bold text-base">
                        <PlusSquare size={20} /> Existing Categories
                    </div>

                    <div className="p-4">
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 size={24} className="animate-spin text-slate-300" />
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {categories.length === 0 ? (
                                    <p className="text-center py-8 text-xs text-slate-400">No categories found</p>
                                ) : (
                                    categories.map((cat) => (
                                        <div key={cat.id} className="flex items-center justify-between py-3">
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{cat.name}</p>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-wider">{cat.status || 'Active'}</p>
                                            </div>
                                            <button
                                                onClick={() => setDeleteId(cat.id)}
                                                className="p-1.5 text-slate-400 hover:text-rose-500 transition"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            {deleteId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl text-center">
                        {deleteResult === 'success' ? (
                            <>
                                <CheckCircle size={40} className="mx-auto text-emerald-500 mb-3" />
                                <h3 className="text-lg font-semibold text-slate-900">Success!</h3>
                                <p className="text-sm text-slate-500 mt-2">Category deleted successfully.</p>
                                <button
                                    onClick={() => {
                                        setDeleteId(null);
                                        setDeleteResult(null);
                                    }}
                                    className="w-full mt-6 rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                                >
                                    OK
                                </button>
                            </>
                        ) : deleteResult === 'error' ? (
                            <>
                                <X size={40} className="mx-auto text-rose-500 mb-3" />
                                <h3 className="text-lg font-semibold text-slate-900">Error</h3>
                                <p className="text-sm text-slate-500 mt-2">Failed to delete the category. Please try again.</p>
                                <button
                                    onClick={() => setDeleteResult(null)}
                                    className="w-full mt-6 rounded-lg bg-slate-100 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-200"
                                >
                                    Try Again
                                </button>
                            </>
                        ) : isDeleting ? (
                            <>
                                <Loader2 size={40} className="mx-auto text-blue-500 mb-3 animate-spin" />
                                <h3 className="text-lg font-semibold text-slate-900">Deleting...</h3>
                                <p className="text-sm text-slate-500 mt-2">Please wait while we remove this category.</p>
                            </>
                        ) : (
                            <>
                                <Trash2 size={32} className="mx-auto text-rose-500 mb-3" />
                                <h3 className="text-lg font-semibold text-slate-900">Delete Category?</h3>
                                <p className="text-sm text-slate-500 mt-2">Are you sure you want to delete this category? This action cannot be undone.</p>
                                <div className="flex gap-3 mt-5 justify-center">
                                    <button onClick={() => setDeleteId(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
                                    <button onClick={handleDelete} className="rounded-lg bg-rose-600 px-4 py-2 text-sm text-white hover:bg-rose-700">Yes, Delete</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
