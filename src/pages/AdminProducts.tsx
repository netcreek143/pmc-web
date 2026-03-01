import { useEffect, useState } from 'react';
import { fetcher, formatCurrency } from '../lib/api';
import LoadingState from '../components/LoadingState';
import { Eye, Pencil, Trash2, CheckCircle, X, Package, Clock, Loader2 } from 'lucide-react';
import { useNotificationStore } from '../lib/notificationStore';

type Product = {
    id: number;
    name: string;
    sku: string;
    price: number;
    sale_price: number;
    stock: number;
    primary_image_url: string;
    category_id: number;
    status: string;
    description?: string;
    custom_printing?: boolean;
};

export default function AdminProducts() {
    const [published, setPublished] = useState<Product[]>([]);
    const [pending, setPending] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [modalMode, setModalMode] = useState<'view' | 'edit' | 'verify' | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [editForm, setEditForm] = useState<any>({});
    const [actionLoading, setActionLoading] = useState(false);

    // Delete confirm
    const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteResult, setDeleteResult] = useState<'success' | 'error' | null>(null);
    const showNotification = useNotificationStore(state => state.show);

    const fetchData = async () => {
        try {
            const [pub, pend] = await Promise.all([
                fetcher('/api/products?status=published'),
                fetcher('/api/products?status=pending'),
            ]);
            setPublished(pub);
            setPending(pend);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openModal = (product: Product, mode: 'view' | 'edit' | 'verify') => {
        setSelectedProduct(product);

        let desc = product.description || '';
        let spec = '';
        if (desc.includes('|||SPEC|||')) {
            [desc, spec] = desc.split('|||SPEC|||');
        }

        setEditForm({
            ...product,
            _desc: desc,
            _spec: spec
        });
        setModalMode(mode);
    };

    const closeModal = () => {
        setModalMode(null);
        setSelectedProduct(null);
        setEditForm({});
    };

    const handleEditSave = async () => {
        setActionLoading(true);
        try {
            const { id, _desc, _spec, description, ...updates } = editForm;
            const finalDescription = _spec ? `${_desc}|||SPEC|||${_spec}` : _desc;

            await fetcher('/api/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...updates, description: finalDescription }),
            });
            showNotification('Product updated successfully', 'success');
            closeModal();
            fetchData();
        } catch (err) {
            console.error(err);
            showNotification('Failed to update product', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (product: Product) => {
        setIsDeleting(true);
        setDeleteResult(null);
        try {
            await fetcher('/api/products', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: product.id }),
            });
            setDeleteResult('success');
            fetchData();
        } catch (err) {
            console.error(err);
            setDeleteResult('error');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleVerify = async () => {
        if (!selectedProduct) return;
        setActionLoading(true);
        try {
            await fetcher('/api/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedProduct.id, status: 'published' }),
            });
            showNotification('Product verified and published!', 'success');
            closeModal();
            fetchData();
        } catch (err) {
            console.error(err);
            showNotification('Failed to verify product', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <LoadingState label="Loading products" />;

    const ProductCard = ({ product, showVerify }: { product: Product; showVerify?: boolean }) => (
        <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/80 p-3 transition hover:shadow-sm">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-200">
                {product.primary_image_url ? (
                    <img src={product.primary_image_url} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400"><Package size={20} /></div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm truncate">{product.name}</p>
                <p className="text-[11px] text-slate-500">SKU: {product.sku} · Stock: {product.stock}</p>
                <p className="text-xs font-semibold text-slate-700 mt-0.5">{formatCurrency(product.sale_price || product.price)}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => openModal(product, 'view')} title="View" className="rounded p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition">
                    <Eye size={15} />
                </button>
                <button onClick={() => openModal(product, 'edit')} title="Edit" className="rounded p-1.5 text-blue-500 hover:bg-blue-50 hover:text-blue-700 transition">
                    <Pencil size={15} />
                </button>
                <button onClick={() => setDeleteConfirm(product)} title="Delete" className="rounded p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition">
                    <Trash2 size={15} />
                </button>
                {showVerify && (
                    <button onClick={() => openModal(product, 'verify')} title="Verify & Publish" className="rounded p-1.5 text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 transition">
                        <CheckCircle size={15} />
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="text-[color:var(--brand)] font-medium">Masters</span> /
                <span className="text-slate-900">Products List</span>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Published Products */}
                <div className="rounded-md border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center gap-2 border-b border-slate-200 bg-[#eae6e1] px-5 py-3 rounded-t-md">
                        <Package size={18} className="text-emerald-600" />
                        <span className="font-bold text-sm text-slate-900">Published Products</span>
                        <span className="ml-auto text-xs font-medium text-slate-500 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{published.length}</span>
                    </div>
                    <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto">
                        {published.length === 0 ? (
                            <p className="text-center text-sm text-slate-400 py-8">No published products yet</p>
                        ) : published.map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                </div>

                {/* Pending Products */}
                <div className="rounded-md border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center gap-2 border-b border-slate-200 bg-[#eae6e1] px-5 py-3 rounded-t-md">
                        <Clock size={18} className="text-amber-500" />
                        <span className="font-bold text-sm text-slate-900">Waiting for Verification</span>
                        <span className="ml-auto text-xs font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{pending.length}</span>
                    </div>
                    <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto">
                        {pending.length === 0 ? (
                            <p className="text-center text-sm text-slate-400 py-8">No products waiting for verification</p>
                        ) : pending.map(p => <ProductCard key={p.id} product={p} showVerify />)}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl text-center">
                        {deleteResult === 'success' ? (
                            <>
                                <CheckCircle size={40} className="mx-auto text-emerald-500 mb-3" />
                                <h3 className="text-lg font-semibold text-slate-900">Success!</h3>
                                <p className="text-sm text-slate-500 mt-2">Product <strong>{deleteConfirm.name}</strong> deleted successfully.</p>
                                <button
                                    onClick={() => {
                                        setDeleteConfirm(null);
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
                                <p className="text-sm text-slate-500 mt-2">Failed to delete the product. Please try again.</p>
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
                                <p className="text-sm text-slate-500 mt-2">Please wait while we remove <strong>{deleteConfirm.name}</strong>.</p>
                            </>
                        ) : (
                            <>
                                <Trash2 size={32} className="mx-auto text-rose-500 mb-3" />
                                <h3 className="text-lg font-semibold text-slate-900">Delete Product?</h3>
                                <p className="text-sm text-slate-500 mt-2">Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.</p>
                                <div className="flex gap-3 mt-5 justify-center">
                                    <button onClick={() => setDeleteConfirm(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
                                    <button onClick={() => handleDelete(deleteConfirm)} className="rounded-lg bg-rose-600 px-4 py-2 text-sm text-white hover:bg-rose-700">Yes, Delete</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* View / Edit / Verify Modal — full-width product page replica */}
            {modalMode && selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 md:p-8">
                    <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
                            <h3 className="text-lg font-semibold text-slate-900">
                                {modalMode === 'view' && 'Product Preview'}
                                {modalMode === 'edit' && 'Edit Product'}
                                {modalMode === 'verify' && 'Verify & Publish'}
                            </h3>
                            <button onClick={closeModal} className="rounded-full p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="overflow-y-auto flex-1">
                            {/* Product Preview (View & Verify mode) — mirrors ProductDetail.tsx */}
                            {(modalMode === 'view' || modalMode === 'verify') && (
                                <div className="p-6 md:p-8 space-y-8">
                                    {/* Top section: Image + Info grid */}
                                    <div className="grid gap-8 md:grid-cols-2">
                                        {/* Left — Image */}
                                        <div>
                                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                                                {selectedProduct.primary_image_url ? (
                                                    <img src={selectedProduct.primary_image_url} alt={selectedProduct.name} className="w-full h-auto max-h-[400px] object-cover" />
                                                ) : (
                                                    <div className="flex h-64 w-full items-center justify-center text-slate-300"><Package size={64} /></div>
                                                )}
                                            </div>
                                        </div>
                                        {/* Right — Product Info */}
                                        <div className="space-y-5">
                                            <div>
                                                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                                                    {selectedProduct.custom_printing ? 'Custom printing' : 'Ready stock'}
                                                </p>
                                                <h2 className="mt-2 text-2xl font-semibold text-slate-900">{selectedProduct.name}</h2>
                                                {(() => {
                                                    const [desc] = selectedProduct.description?.includes('|||SPEC|||')
                                                        ? selectedProduct.description.split('|||SPEC|||')
                                                        : [selectedProduct.description || ''];
                                                    return desc ? <p className="mt-3 text-sm text-slate-600 leading-relaxed whitespace-pre-line">{desc}</p> : null;
                                                })()}
                                            </div>
                                            {/* Price card */}
                                            <div className="rounded-2xl border border-slate-200 bg-white p-5">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm text-slate-500">Price per unit</p>
                                                    <p className="text-2xl font-semibold text-slate-900">{formatCurrency(selectedProduct.sale_price || selectedProduct.price)}</p>
                                                </div>
                                                {selectedProduct.sale_price > 0 && selectedProduct.sale_price < selectedProduct.price && (
                                                    <p className="text-right text-sm text-slate-400 line-through mt-1">{formatCurrency(selectedProduct.price)}</p>
                                                )}
                                                <div className="mt-4 flex items-center gap-3">
                                                    <input type="number" min={10} defaultValue={10} className="w-24 rounded-full border border-slate-200 px-4 py-2 text-sm" readOnly />
                                                    <button className="rounded-full bg-[color:var(--brand)] px-6 py-2.5 text-sm font-semibold text-white opacity-60 cursor-default">
                                                        Add to cart
                                                    </button>
                                                </div>
                                            </div>
                                            {/* Status & Stock badges */}
                                            <div className="flex flex-wrap gap-3">
                                                <span className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-medium text-slate-600">
                                                    Stock: {selectedProduct.stock}
                                                </span>
                                                <span className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-medium text-slate-600">
                                                    SKU: {selectedProduct.sku}
                                                </span>
                                                <span className={`rounded-full px-4 py-1.5 text-xs font-medium ${selectedProduct.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {selectedProduct.status === 'published' ? '● Published' : '● Pending'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Bottom section: Specs */}
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="rounded-2xl border border-slate-200 bg-white p-5">
                                            <h3 className="text-sm font-semibold text-slate-800">Specifications</h3>
                                            <div className="mt-3 grid gap-2 text-sm text-slate-600">
                                                {(() => {
                                                    const specText = selectedProduct.description?.includes('|||SPEC|||')
                                                        ? selectedProduct.description.split('|||SPEC|||')[1]
                                                        : '';
                                                    return specText ? (
                                                        <p className="whitespace-pre-line">{specText}</p>
                                                    ) : (
                                                        <>
                                                            <p>MOQ: 10 units</p>
                                                            <p>GST: 18% (9% CGST + 9% SGST)</p>
                                                            <p>Backorder: {selectedProduct.stock > 0 ? 'Available' : 'On request'}</p>
                                                            <p>Custom printing: {selectedProduct.custom_printing ? 'Yes' : 'No'}</p>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                        <div className="rounded-2xl border border-slate-200 bg-white p-5">
                                            <h3 className="text-sm font-semibold text-slate-800">Bulk Pricing</h3>
                                            <p className="mt-3 text-sm text-slate-500">Contact sales for custom bulk pricing.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Edit Form */}
                            {modalMode === 'edit' && (
                                <div className="p-6 md:p-8 space-y-6">
                                    <div className="grid gap-8 md:grid-cols-2">
                                        {/* Left — Image preview */}
                                        <div>
                                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 mb-3">
                                                {editForm.primary_image_url ? (
                                                    <img src={editForm.primary_image_url} alt="" className="w-full h-auto max-h-[300px] object-cover" />
                                                ) : (
                                                    <div className="flex h-48 w-full items-center justify-center text-slate-300"><Package size={48} /></div>
                                                )}
                                            </div>
                                            <div>
                                                <label className="text-[11px] font-semibold text-slate-700">Image URL</label>
                                                <input value={editForm.primary_image_url || ''} onChange={e => setEditForm({ ...editForm, primary_image_url: e.target.value })} className="w-full rounded border border-slate-200 px-3 py-2 text-sm mt-1" />
                                            </div>
                                        </div>
                                        {/* Right — Form fields */}
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-[11px] font-semibold text-slate-700">Product Name</label>
                                                <input value={editForm.name || ''} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full rounded border border-slate-200 px-3 py-2 text-sm mt-1" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-[11px] font-semibold text-slate-700">Price</label>
                                                    <input type="number" value={editForm.price || 0} onChange={e => setEditForm({ ...editForm, price: Number(e.target.value) })} className="w-full rounded border border-slate-200 px-3 py-2 text-sm mt-1" />
                                                </div>
                                                <div>
                                                    <label className="text-[11px] font-semibold text-slate-700">Sale Price</label>
                                                    <input type="number" value={editForm.sale_price || 0} onChange={e => setEditForm({ ...editForm, sale_price: Number(e.target.value) })} className="w-full rounded border border-slate-200 px-3 py-2 text-sm mt-1" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-[11px] font-semibold text-slate-700">Stock</label>
                                                    <input type="number" value={editForm.stock || 0} onChange={e => setEditForm({ ...editForm, stock: Number(e.target.value) })} className="w-full rounded border border-slate-200 px-3 py-2 text-sm mt-1" />
                                                </div>
                                                <div>
                                                    <label className="text-[11px] font-semibold text-slate-700">SKU</label>
                                                    <input value={editForm.sku || ''} onChange={e => setEditForm({ ...editForm, sku: e.target.value })} className="w-full rounded border border-slate-200 px-3 py-2 text-sm mt-1" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[11px] font-semibold text-slate-700">Description</label>
                                                <textarea value={editForm._desc || ''} onChange={e => setEditForm({ ...editForm, _desc: e.target.value })} rows={3} className="w-full rounded border border-slate-200 px-3 py-2 text-sm mt-1 resize-none" />
                                            </div>
                                            <div>
                                                <label className="text-[11px] font-semibold text-slate-700">Specifications</label>
                                                <textarea value={editForm._spec || ''} onChange={e => setEditForm({ ...editForm, _spec: e.target.value })} rows={3} className="w-full rounded border border-slate-200 px-3 py-2 text-sm mt-1 resize-none" placeholder="Enter specifications here..." />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="shrink-0 border-t border-slate-200 px-6 py-4 flex justify-end gap-3 bg-slate-50">
                            <button onClick={closeModal} className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100">
                                Close
                            </button>
                            {modalMode === 'edit' && (
                                <button onClick={handleEditSave} disabled={actionLoading} className="rounded-lg bg-[#20403e] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1a3331] disabled:opacity-50 flex items-center gap-2">
                                    {actionLoading && <Loader2 size={14} className="animate-spin" />}
                                    Save Changes
                                </button>
                            )}
                            {modalMode === 'verify' && (
                                <button onClick={handleVerify} disabled={actionLoading} className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2">
                                    {actionLoading && <Loader2 size={14} className="animate-spin" />}
                                    <CheckCircle size={14} /> Confirm & Publish
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
