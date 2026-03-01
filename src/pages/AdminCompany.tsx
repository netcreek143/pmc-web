import { Home, Eye, Send, Ban, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetcher } from '../lib/api';

export default function AdminCompany() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        company_name: '',
        logo_url: '',
        plot_no: '',
        address_line: '',
        country: 'India',
        state: '',
        city: '',
        locality: '',
        zip_code: '',
        phone: '',
        mobile: '',
        website: '',
        email: '',
        gst_number: '',
        pan_no: ''
    });

    const loadCompany = async () => {
        try {
            setLoading(true);
            const data = await fetcher('/api/company');
            if (data && data.company_name) {
                setFormData(prev => ({ ...prev, ...data }));
            }
        } catch (err) {
            console.error('Failed to load company config', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCompany();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setLogoFile(e.target.files[0]);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            let logo_url = formData.logo_url;

            // TODO: In a real app, we would upload the logoFile to a storage bucket first
            // and get a new URL. For now, we'll just use the existing logo_url or a placeholder.
            // If the user wants real uploads, we can implement an /api/upload endpoint.

            const payload = { ...formData, logo_url };

            await fetcher('/api/company', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            await loadCompany();
            setLogoFile(null);
            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-slate-400" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-500">
                    <span className="text-[color:var(--brand)] font-medium">Home</span> /
                    <span>Settings</span> /
                    <span className="text-slate-900">Company Details</span>
                </div>
                <button className="flex items-center gap-2 rounded bg-[#e87c48] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#d46a39]">
                    <Eye size={14} /> View Company Details
                </button>
            </div>

            <div className="rounded-md border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col items-center justify-center border-b border-slate-200 bg-[#eae6e1] py-4 text-center rounded-t-md">
                    <div className="flex items-center gap-2 text-lg font-bold text-slate-900">
                        <Home size={20} /> Company Details
                    </div>
                    <p className="text-xs font-semibold text-slate-700 mt-1">Displayed on sales orders, invoices & documents</p>
                </div>

                <div className="p-6 md:p-8 text-sm">
                    {/* Top Row: Name and Logo */}
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="font-semibold text-slate-700 text-xs">Company Name<span className="text-rose-500">*</span></label>
                            <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} placeholder="Pack My Cake" className="w-full rounded bg-slate-100 border-none px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:ring-1 focus:ring-slate-300" />
                        </div>
                        <div className="space-y-2">
                            <label className="font-semibold text-slate-700 text-xs">Upload Logo<span className="text-rose-500">*</span></label>
                            <div className="flex items-center gap-3">
                                <label className="cursor-pointer rounded border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100">
                                    Choose file
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </label>
                                <span className="text-xs text-slate-500 truncate max-w-[150px]">
                                    {logoFile ? logoFile.name : (formData.logo_url ? 'Existing logo uploaded' : 'No file chosen')}
                                </span>
                                {formData.logo_url && !logoFile && (
                                    <img src={formData.logo_url} alt="Logo" className="h-8 max-w-[100px] object-contain ml-2 border rounded" />
                                )}
                            </div>
                            <p className="text-[10px] text-slate-400">accept only ('jpg', 'jpeg', 'png', 'gif', 'pdf')</p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-base font-semibold text-[#2b2b68] mb-6">Primary Location/Contact Details</h3>
                        <div className="grid gap-x-6 gap-y-5 md:grid-cols-3 lg:grid-cols-5">

                            <div className="space-y-1.5 lg:col-span-1">
                                <label className="font-semibold text-slate-700 text-[11px]">Plot No.<span className="text-rose-500">*</span></label>
                                <input type="text" name="plot_no" value={formData.plot_no} onChange={handleChange} placeholder="ex: plot no-2" className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400" />
                            </div>

                            <div className="space-y-1.5 lg:col-span-2">
                                <label className="font-semibold text-slate-700 text-[11px]">Address Line<span className="text-rose-500">*</span></label>
                                <input type="text" name="address_line" value={formData.address_line} onChange={handleChange} placeholder="Enter Your Company Address" className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400" />
                            </div>

                            <div className="space-y-1.5 lg:col-span-1">
                                <label className="font-semibold text-slate-700 text-[11px]">Country<span className="text-rose-500">*</span></label>
                                <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="India" className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-500" />
                            </div>

                            <div className="space-y-1.5 lg:col-span-1">
                                <label className="font-semibold text-slate-700 text-[11px]">State<span className="text-rose-500">*</span></label>
                                <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="Enter State" className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400" />
                            </div>

                            <div className="space-y-1.5 lg:col-span-1">
                                <label className="font-semibold text-slate-700 text-[11px]">City<span className="text-rose-500">*</span></label>
                                <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Enter City" className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400" />
                            </div>

                            <div className="space-y-1.5 lg:col-span-1">
                                <label className="font-semibold text-slate-700 text-[11px]">Locality/Village<span className="text-rose-500">*</span></label>
                                <input type="text" name="locality" value={formData.locality} onChange={handleChange} placeholder="Enter Locality" className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400" />
                            </div>

                            <div className="space-y-1.5 lg:col-span-1">
                                <label className="font-semibold text-slate-700 text-[11px]">Zip Code<span className="text-rose-500">*</span></label>
                                <input type="text" name="zip_code" value={formData.zip_code} onChange={handleChange} placeholder="Enter Zipcode" className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400" />
                            </div>

                            <div className="space-y-1.5 lg:col-span-1">
                                <label className="font-semibold text-slate-700 text-[11px]">Phone<span className="text-rose-500">*</span></label>
                                <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter Phone Number" className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400" />
                            </div>

                            <div className="space-y-1.5 lg:col-span-1">
                                <label className="font-semibold text-slate-700 text-[11px]">Mobile<span className="text-rose-500">*</span></label>
                                <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Enter Mobile Number" className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400" />
                            </div>

                            <div className="space-y-1.5 lg:col-span-1">
                                <label className="font-semibold text-slate-700 text-[11px]">Website</label>
                                <input type="text" name="website" value={formData.website} onChange={handleChange} placeholder="Enter Domain" className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400" />
                            </div>

                            <div className="space-y-1.5 lg:col-span-2">
                                <label className="font-semibold text-slate-700 text-[11px]">Email<span className="text-rose-500">*</span></label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter Email address" className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400" />
                            </div>

                            <div className="space-y-1.5 lg:col-span-1">
                                <label className="font-semibold text-slate-700 text-[11px]">GST Number<span className="text-rose-500">*</span></label>
                                <input type="text" name="gst_number" value={formData.gst_number} onChange={handleChange} placeholder="Enter GST Number" className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400" />
                            </div>

                            <div className="space-y-1.5 lg:col-span-1">
                                <label className="font-semibold text-slate-700 text-[11px]">PAN No</label>
                                <input type="text" name="pan_no" value={formData.pan_no} onChange={handleChange} placeholder="Enter PAN Number" className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400" />
                            </div>

                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100">
                        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded bg-[#20403e] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#1a3331] disabled:opacity-50">
                            {saving ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button className="flex items-center gap-2 rounded bg-[#891630] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#6d1126]">
                            <Ban size={14} /> Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
