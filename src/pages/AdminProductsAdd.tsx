import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Send, Ban, FileUp, Bold, Italic, Link, List, ListOrdered, Loader2, Upload } from 'lucide-react';
import { fetcher } from '../lib/api';
import { useNotificationStore } from '../lib/notificationStore';

type Category = { id: number; name: string };

const emptyForm = {
    name: '',
    sku: '',
    price: '',
    stock: '',
    category_id: '',
    brand: '',
    cgst: '',
    sgst: '',
    igst: '',
    description: '',
    specification: '',
    unit_weight: '',
    hsn_code: '',
    primary_image_url: '',
};

export default function AdminProductsAdd() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ ...emptyForm });
    const [categories, setCategories] = useState<Category[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    const [bulkUploading, setBulkUploading] = useState(false);
    const showNotification = useNotificationStore(state => state.show);

    useEffect(() => {
        fetcher('/api/categories').then(setCategories).catch(console.error);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const fileToDataUrl = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleSave = async () => {
        if (!form.name.trim()) {
            showNotification('Product name is required.', 'error');
            return;
        }
        setSaving(true);
        try {
            let imageUrl = form.primary_image_url;
            if (imageFile) {
                try {
                    imageUrl = await fileToDataUrl(imageFile);
                } catch {
                    console.warn('Image conversion failed, saving without image');
                }
            }

            // Combine description and specification with separator
            const combinedDesc = form.specification
                ? `${form.description || ''}|||SPEC|||${form.specification}`
                : (form.description || '');

            const payload: any = {
                name: form.name,
                description: combinedDesc,
                sku: form.sku || `SKU-${Date.now()}`,
                price: Number(form.price) || 0,
                stock: Number(form.stock) || 0,
                category_id: Number(form.category_id) || 1,
                primary_image_url: imageUrl,
                status: 'pending',
            };

            await fetcher('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            showNotification('Product saved! It will appear in "Waiting for Verification".', 'success');
            navigate('/admin/products');
        } catch (err: any) {
            console.error('Save error:', err);
            showNotification('Failed to save product: ' + (err.message || 'Unknown error'), 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setBulkUploading(true);
        try {
            const text = await file.text();
            const lines = text.split('\n').filter(l => l.trim());
            const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

            let count = 0;
            for (let i = 1; i < lines.length; i++) {
                const cols = lines[i].split(',').map(c => c.trim());
                const row: any = {};
                headers.forEach((h, idx) => { row[h] = cols[idx] || ''; });

                const payload: any = {
                    name: row.name || row.product_name || `Product ${i}`,
                    sku: row.sku || `BULK-${Date.now()}-${i}`,
                    price: Number(row.price) || 0,
                    stock: Number(row.stock) || 0,
                    category_id: Number(row.category_id) || 1,
                    primary_image_url: row.image_url || row.primary_image_url || '',
                    status: 'pending',
                };

                await fetcher('/api/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                count++;
            }
            showNotification(`${count} products uploaded! They are now waiting for verification.`, 'success');
            navigate('/admin/products');
        } catch (err: any) {
            console.error('Bulk upload error:', err);
            showNotification('Bulk upload failed: ' + (err.message || 'Unknown error'), 'error');
        } finally {
            setBulkUploading(false);
            e.target.value = '';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-500">
                    <span className="text-[color:var(--brand)] font-medium">Masters</span> /
                    <span className="text-slate-900">Product Register</span>
                </div>
                <div className="flex items-center gap-3">
                    <label className={`flex items-center gap-2 rounded bg-[#4f6b86] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#3c5267] cursor-pointer ${bulkUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                        {bulkUploading ? <Loader2 size={14} className="animate-spin" /> : <FileUp size={14} />}
                        {bulkUploading ? 'Uploading...' : 'Bulk Uploads'}
                        <input type="file" accept=".csv" className="hidden" onChange={handleBulkUpload} disabled={bulkUploading} />
                    </label>
                </div>
            </div>

            <div className="rounded-md border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-200 bg-[#eae6e1] px-6 py-4 rounded-t-md text-slate-900 font-bold text-base">
                    <Box size={20} /> Add Products
                </div>

                <div className="p-6 md:p-8 text-sm">
                    <div className="grid gap-x-6 gap-y-5 md:grid-cols-4">

                        {/* Row 1 */}
                        <div className="space-y-1.5 md:col-span-1">
                            <label className="font-semibold text-slate-700 text-[11px]">Product Code</label>
                            <input type="text" name="sku" value={form.sku} onChange={handleChange} placeholder="Enter Product Code" className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400" />
                        </div>
                        <div className="space-y-1.5 md:col-span-1">
                            <label className="font-semibold text-slate-700 text-[11px]">Product Name<span className="text-rose-500">*</span></label>
                            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Enter Product Name" className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400" />
                        </div>
                        <div className="space-y-1.5 md:col-span-1">
                            <label className="font-semibold text-slate-700 text-[11px]">Category</label>
                            <select name="category_id" value={form.category_id} onChange={handleChange} className="w-full rounded border border-slate-200 px-3 py-2 text-xs text-slate-500 bg-white">
                                <option value="">Select</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5 md:col-span-1">
                            <label className="font-semibold text-slate-700 text-[11px]">Sub Category</label>
                            <select className="w-full rounded border border-slate-200 px-3 py-2 text-xs text-slate-500 bg-white">
                                <option>Select a category first</option>
                            </select>
                        </div>

                        {/* Row 2 */}
                        <div className="space-y-1.5 md:col-span-1">
                            <label className="font-semibold text-slate-700 text-[11px]">Brand</label>
                            <input type="text" name="brand" value={form.brand} onChange={handleChange} placeholder="Enter Brand name" className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400" />
                        </div>
                        <div className="space-y-1.5 md:col-span-1">
                            <label className="font-semibold text-slate-700 text-[11px]">CGST (Within Tamilnadu)</label>
                            <input type="text" name="cgst" value={form.cgst} onChange={handleChange} placeholder="Enter CGST" className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400" />
                        </div>
                        <div className="space-y-1.5 md:col-span-1">
                            <label className="font-semibold text-slate-700 text-[11px]">SGST (Within Tamilnadu)</label>
                            <input type="text" name="sgst" value={form.sgst} onChange={handleChange} placeholder="Enter SGST" className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400" />
                        </div>
                        <div className="space-y-1.5 md:col-span-1">
                            <label className="font-semibold text-slate-700 text-[11px]">IGST (Other States)</label>
                            <input type="text" name="igst" value={form.igst} onChange={handleChange} placeholder="Enter IGST" className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400" />
                        </div>

                        {/* Row 3 - Description & Specification side by side */}
                        <div className="md:col-span-2 space-y-1.5 mt-2">
                            <label className="font-semibold text-slate-700 text-[11px]">Product Description</label>
                            <div className="rounded border border-slate-200 overflow-hidden">
                                <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 py-1 flex-wrap">
                                    <Bold size={14} className="text-slate-600 mx-1 cursor-pointer hover:text-slate-900" />
                                    <Italic size={14} className="text-slate-600 mx-1 cursor-pointer hover:text-slate-900" />
                                    <div className="h-4 w-px bg-slate-200 mx-1"></div>
                                    <Link size={14} className="text-slate-600 mx-1 cursor-pointer hover:text-slate-900" />
                                    <List size={14} className="text-slate-600 mx-1 cursor-pointer hover:text-slate-900" />
                                    <ListOrdered size={14} className="text-slate-600 mx-1 cursor-pointer hover:text-slate-900" />
                                </div>
                                <textarea name="description" value={form.description} onChange={handleChange} rows={5} placeholder="Write product description...." className="w-full border-none p-3 text-xs placeholder-slate-400 focus:ring-0 outline-none resize-none"></textarea>
                            </div>
                        </div>
                        <div className="md:col-span-2 space-y-1.5 mt-2">
                            <label className="font-semibold text-slate-700 text-[11px]">Product Specification</label>
                            <div className="rounded border border-slate-200 overflow-hidden">
                                <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 py-1 flex-wrap">
                                    <Bold size={14} className="text-slate-600 mx-1 cursor-pointer hover:text-slate-900" />
                                    <Italic size={14} className="text-slate-600 mx-1 cursor-pointer hover:text-slate-900" />
                                    <div className="h-4 w-px bg-slate-200 mx-1"></div>
                                    <Link size={14} className="text-slate-600 mx-1 cursor-pointer hover:text-slate-900" />
                                    <List size={14} className="text-slate-600 mx-1 cursor-pointer hover:text-slate-900" />
                                    <ListOrdered size={14} className="text-slate-600 mx-1 cursor-pointer hover:text-slate-900" />
                                </div>
                                <textarea name="specification" value={form.specification} onChange={handleChange} rows={5} placeholder="Write product specifications...." className="w-full border-none p-3 text-xs placeholder-slate-400 focus:ring-0 outline-none resize-none"></textarea>
                            </div>
                        </div>

                        {/* Row 4 */}
                        <div className="space-y-1.5 md:col-span-1 mt-2">
                            <label className="font-semibold text-slate-700 text-[11px]">Upload Product Image</label>
                            <div className="flex items-center gap-3">
                                <label className="rounded border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 cursor-pointer">
                                    <Upload size={12} className="inline mr-1" />Choose file
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                </label>
                                <span className="text-xs text-slate-500 truncate max-w-[150px]">{imageFile ? imageFile.name : 'No file chosen'}</span>
                            </div>
                        </div>
                        <div className="space-y-1.5 md:col-span-1 mt-2">
                            <label className="font-semibold text-slate-700 text-[11px]">Unit Weight (in grams)</label>
                            <input type="text" name="unit_weight" value={form.unit_weight} onChange={handleChange} className="w-full rounded border border-slate-200 px-3 py-2 text-xs" />
                        </div>
                        <div className="space-y-1.5 md:col-span-1 mt-2">
                            <label className="font-semibold text-slate-700 text-[11px]">Select Type</label>
                            <select className="w-full rounded border border-slate-200 px-3 py-2 text-xs text-slate-500 bg-white">
                                <option>Select</option>
                            </select>
                        </div>
                        <div className="space-y-1.5 md:col-span-1 mt-2">
                            <label className="font-semibold text-slate-700 text-[11px]">HSN Code</label>
                            <input type="text" name="hsn_code" value={form.hsn_code} onChange={handleChange} placeholder="Enter HSN Code" className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400" />
                        </div>

                        {/* Row 5 */}
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="font-semibold text-slate-700 text-[11px]">Total Stock Count</label>
                            <input type="text" name="stock" value={form.stock} onChange={handleChange} placeholder="Enter Total Stock" className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400" />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="font-semibold text-slate-700 text-[11px]">Price</label>
                            <input type="text" name="price" value={form.price} onChange={handleChange} placeholder="Enter Price" className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400" />
                        </div>

                    </div>

                    <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100">
                        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded bg-[#20403e] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#1a3331] disabled:opacity-50">
                            {saving ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button onClick={() => setForm({ ...emptyForm })} className="flex items-center gap-2 rounded bg-[#891630] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#6d1126]">
                            <Ban size={14} /> Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
