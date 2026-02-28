import { useState, useEffect } from 'react';
import { FileText, Save, Loader2 } from 'lucide-react';
import { fetcher } from '../lib/api';

const defaultSettings = {
    terms: `1. Goods once sold will not be taken back or exchanged.
2. All disputes subject to Madurai jurisdiction only.
3. Interest @ 18% p.a. will be charged on overdue payments.
4. E & O.E.
5. This is a computer generated invoice.`,
    declaration: `We certify that this invoice shows the actual price of the goods described and that all particulars are true and correct.`,
    bank_account_name: 'Pack My Cake',
    bank_name: 'State Bank of India',
    bank_ac_no: '',
    bank_ifsc: '',
    default_shipping: '120.00',
};

export default function AdminInvoice() {
    const [settings, setSettings] = useState({ ...defaultSettings });
    const [company, setCompany] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const [inviteData, companyData] = await Promise.all([
                    fetcher('/api/invoice-settings'),
                    fetcher('/api/company')
                ]);
                if (inviteData && Object.keys(inviteData).length > 0) {
                    setSettings(prev => ({ ...prev, ...inviteData }));
                }
                if (companyData && Object.keys(companyData).length > 0) {
                    setCompany(companyData);
                }
            } catch (err) {
                console.error('Fetch error:', err);
            }
            setLoading(false);
        })();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await fetcher('/api/invoice-settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });
            alert('Invoice settings saved!');
        } catch (err: any) {
            alert('Failed to save: ' + err.message);
        }
        setSaving(false);
    };

    const handleChange = (field: string, value: string) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    // Sample data for preview
    const sample = {
        company_name: company?.company_name || 'PACK MY CAKE',
        company_address: company ? `${company.plot_no}, ${company.address_line}, ${company.locality}, ${company.city}, ${company.state} - ${company.zip_code}` : '145 / 3, East Marret Street , Panthadi 7th Street , Madurai Main , Panthadi , Panthadi, Madurai - 625009, TN, India',
        company_mobile: company?.mobile || '9791195777',
        company_gstin: company?.gst_number || '33ALOPM8700C1ZA',
        company_pan: company?.pan_no || 'ALOPM8700C',
        company_state: company?.state || 'Tamil Nadu',
        company_state_code: '33 (TN)',
        invoice_no: 'INV-13',
        order_id: '13',
        date: '21/01/2026',
        trans_id: 'order_S3bt5gk7de3K',
        customer_name: 'Rathi dhariyaa J',
        shipping_address: '31,Anthoiyar kovil street,Old kuyavar palayam road\nMadurai, Tamil Nadu\nPIN: 625009\nMobile: 7598265777\nEmail: rathidhariyajaganathan@gmail.com',
        billing_address: '31,Anthoiyar kovil street,Old kuyavar palayam road\nMadurai\nTamil Nadu - 625009\nMobile: 7598265777',
        items: [
            { sr: 1, desc: 'Brownie Box - 7x4x2-Blue Pattern-(Box 1-10 Pieces)', hsn: '4819', qty: 1, rate: 260.00, taxable: 260.00, sgst: '2.50%', cgst: '2.50%', igst: 'Not Applicable', amount: 291.20 },
            { sr: 2, desc: 'Cake Box - 7x7x3 - Simple Pattern (Box 1-10 Pieces)', hsn: '4819', qty: 1, rate: 380.00, taxable: 380.00, sgst: '2.50%\n7.80', cgst: '2.50%\n7.80', igst: 'Not Applicable', amount: 395.20 },
        ],
        total_taxable: 640.00,
        cgst_total: 15.20,
        sgst_total: 15.20,
        sub_total: 686.40,
        shipping: 120.00,
        invoice_total: 806.40,
        amount_words: 'Eight Hundred Six Rupees Only',
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 size={24} className="animate-spin text-slate-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <p className="text-sm text-slate-500">
                <span className="text-[#b76e5e] font-semibold">Masters</span>
                <span className="mx-1">/</span>
                Invoice Settings
            </p>

            {/* Settings Panel */}
            <div className="rounded-md border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-200 bg-[#eae6e1] px-6 py-4 rounded-t-md text-slate-900 font-bold text-base">
                    <FileText size={20} /> Invoice Settings
                </div>
                <div className="p-6 md:p-8 space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Terms & Conditions */}
                        <div className="space-y-1.5">
                            <label className="font-semibold text-slate-700 text-xs">Terms & Conditions</label>
                            <textarea
                                value={settings.terms}
                                onChange={e => handleChange('terms', e.target.value)}
                                rows={6}
                                className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400 resize-none"
                            />
                        </div>
                        {/* Declaration */}
                        <div className="space-y-1.5">
                            <label className="font-semibold text-slate-700 text-xs">Declaration</label>
                            <textarea
                                value={settings.declaration}
                                onChange={e => handleChange('declaration', e.target.value)}
                                rows={6}
                                className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400 resize-none"
                            />
                        </div>
                    </div>
                    <div className="grid gap-6 md:grid-cols-4">
                        <div className="space-y-1.5">
                            <label className="font-semibold text-slate-700 text-xs">Bank Account Name</label>
                            <input value={settings.bank_account_name} onChange={e => handleChange('bank_account_name', e.target.value)} className="w-full rounded border border-slate-200 px-3 py-2 text-xs" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="font-semibold text-slate-700 text-xs">Bank Name</label>
                            <input value={settings.bank_name} onChange={e => handleChange('bank_name', e.target.value)} className="w-full rounded border border-slate-200 px-3 py-2 text-xs" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="font-semibold text-slate-700 text-xs">A/C No</label>
                            <input value={settings.bank_ac_no} onChange={e => handleChange('bank_ac_no', e.target.value)} className="w-full rounded border border-slate-200 px-3 py-2 text-xs" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="font-semibold text-slate-700 text-xs">IFSC Code</label>
                            <input value={settings.bank_ifsc} onChange={e => handleChange('bank_ifsc', e.target.value)} className="w-full rounded border border-slate-200 px-3 py-2 text-xs" />
                        </div>
                    </div>
                    <div className="grid gap-6 md:grid-cols-4">
                        <div className="space-y-1.5">
                            <label className="font-semibold text-slate-700 text-xs">Default Shipping (₹)</label>
                            <input value={settings.default_shipping} onChange={e => handleChange('default_shipping', e.target.value)} className="w-full rounded border border-slate-200 px-3 py-2 text-xs" />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button onClick={handleSave} disabled={saving} className="rounded-lg bg-[#BE6154] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#a14d42] disabled:opacity-50 flex items-center gap-2">
                            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                            Save Settings
                        </button>
                    </div>
                </div>
            </div>

            {/* Live Invoice Preview */}
            <div className="rounded-md border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-200 bg-[#eae6e1] px-6 py-4 rounded-t-md text-slate-900 font-bold text-base">
                    <FileText size={20} /> Invoice Preview
                </div>
                <div className="p-6 md:p-8">
                    {/* Invoice Container */}
                    <div className="mx-auto max-w-[800px] border border-slate-300 bg-white text-[11px] leading-relaxed" style={{ fontFamily: 'Arial, sans-serif' }}>

                        {/* Header Area */}
                        <div className="flex flex-col items-center py-6 border-b border-slate-300">
                            <img src="/logo-invoice.png" alt="Pack My Cake Logo" className="h-20 w-auto mb-4" />
                            <h1 className="text-lg font-bold tracking-wider text-slate-900">{sample.company_name}</h1>
                            <p className="text-[9px] text-slate-600 mt-0.5 px-8 text-center">{sample.company_address}</p>
                            <p className="text-[9px] text-slate-600 text-center">Mobile: {sample.company_mobile}</p>
                            <p className="text-[10px] text-slate-700 font-semibold mt-1 text-center">GSTIN: {sample.company_gstin} | PAN: {sample.company_pan}</p>
                            <h2 className="text-sm font-bold text-blue-800 mt-2 underline text-center">TAX INVOICE</h2>
                        </div>

                        {/* Sold By / Ship To / Bill To */}
                        <div className="grid grid-cols-3 border-b border-slate-300 text-[9px]">
                            <div className="border-r border-slate-300 p-3">
                                <p className="font-bold text-slate-800 text-[10px] mb-1">Sold By</p>
                                <p className="font-semibold">{sample.company_name}</p>
                                <p className="whitespace-pre-line text-slate-600">{sample.company_address}</p>
                                <p className="text-slate-600">GSTIN: {sample.company_gstin}</p>
                                <p className="text-slate-600">State: {sample.company_state}</p>
                            </div>
                            <div className="border-r border-slate-300 p-3">
                                <p className="font-bold text-slate-800 text-[10px] mb-1">Ship To</p>
                                <p className="font-semibold text-blue-700">{sample.customer_name}</p>
                                <p className="whitespace-pre-line text-slate-600">{sample.shipping_address}</p>
                            </div>
                            <div className="p-3">
                                <p className="font-bold text-slate-800 text-[10px] mb-1">Bill To</p>
                                <p className="font-semibold text-blue-700">{sample.customer_name}</p>
                                <p className="whitespace-pre-line text-slate-600">{sample.billing_address}</p>
                            </div>
                        </div>

                        {/* Invoice Meta Row */}
                        <div className="grid grid-cols-4 border-b border-slate-300 text-[9px] text-center">
                            <div className="border-r border-slate-300 py-2 px-2">
                                <span className="font-bold">Invoice No:</span> <span className="text-slate-700">{sample.invoice_no}</span>
                            </div>
                            <div className="border-r border-slate-300 py-2 px-2">
                                <span className="font-bold">Order ID:</span> <span className="text-slate-700">{sample.order_id}</span>
                            </div>
                            <div className="border-r border-slate-300 py-2 px-2">
                                <span className="font-bold">Date:</span> <span className="text-slate-700">{sample.date}</span>
                            </div>
                            <div className="py-2 px-2">
                                <span className="font-bold">Trans ID:</span> <span className="text-slate-700 break-all">{sample.trans_id}</span>
                            </div>
                        </div>

                        {/* Product Table */}
                        <div className="border-b border-slate-300">
                            <table className="w-full text-[9px]">
                                <thead>
                                    <tr className="bg-[#142F41] text-white">
                                        <th className="py-1.5 px-2 text-left font-semibold border-r border-[#244961] w-[5%]">Sr.</th>
                                        <th className="py-1.5 px-2 text-left font-semibold border-r border-[#244961] w-[30%]">Product Description</th>
                                        <th className="py-1.5 px-2 text-center font-semibold border-r border-[#244961] w-[7%]">HSN</th>
                                        <th className="py-1.5 px-2 text-center font-semibold border-r border-[#244961] w-[5%]">Qty</th>
                                        <th className="py-1.5 px-2 text-center font-semibold border-r border-[#244961] w-[9%]">Rate (₹)</th>
                                        <th className="py-1.5 px-2 text-center font-semibold border-r border-[#244961] w-[9%]">Taxable (₹)</th>
                                        <th className="py-1.5 px-2 text-center font-semibold border-r border-[#244961] w-[8%]">SGST</th>
                                        <th className="py-1.5 px-2 text-center font-semibold border-r border-[#244961] w-[8%]">CGST</th>
                                        <th className="py-1.5 px-2 text-center font-semibold border-r border-[#244961] w-[9%]">IGST</th>
                                        <th className="py-1.5 px-2 text-right font-semibold w-[10%]">Amount (₹)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sample.items.map((item, i) => (
                                        <tr key={i} className="border-b border-slate-200">
                                            <td className="py-1.5 px-2 border-r border-slate-200 text-center">{item.sr}</td>
                                            <td className="py-1.5 px-2 border-r border-slate-200">{item.desc}</td>
                                            <td className="py-1.5 px-2 border-r border-slate-200 text-center">{item.hsn}</td>
                                            <td className="py-1.5 px-2 border-r border-slate-200 text-center">{item.qty}</td>
                                            <td className="py-1.5 px-2 border-r border-slate-200 text-center">{item.rate.toFixed(2)}</td>
                                            <td className="py-1.5 px-2 border-r border-slate-200 text-center">{item.taxable.toFixed(2)}</td>
                                            <td className="py-1.5 px-2 border-r border-slate-200 text-center whitespace-pre-line">{item.sgst}</td>
                                            <td className="py-1.5 px-2 border-r border-slate-200 text-center whitespace-pre-line">{item.cgst}</td>
                                            <td className="py-1.5 px-2 border-r border-slate-200 text-center">{item.igst}</td>
                                            <td className="py-1.5 px-2 text-right">{item.amount.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    {/* Empty rows */}
                                    {[...Array(4)].map((_, i) => (
                                        <tr key={`empty-${i}`} className="border-b border-slate-200">
                                            <td className="py-1.5 px-2 border-r border-slate-200">&nbsp;</td>
                                            <td className="py-1.5 px-2 border-r border-slate-200"></td>
                                            <td className="py-1.5 px-2 border-r border-slate-200"></td>
                                            <td className="py-1.5 px-2 border-r border-slate-200"></td>
                                            <td className="py-1.5 px-2 border-r border-slate-200"></td>
                                            <td className="py-1.5 px-2 border-r border-slate-200"></td>
                                            <td className="py-1.5 px-2 border-r border-slate-200"></td>
                                            <td className="py-1.5 px-2 border-r border-slate-200"></td>
                                            <td className="py-1.5 px-2 border-r border-slate-200"></td>
                                            <td className="py-1.5 px-2"></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals + Terms Row */}
                        <div className="grid grid-cols-2 border-b border-slate-300 text-[9px]">
                            {/* Left: Totals */}
                            <div className="border-r border-slate-300 p-3">
                                <table className="w-full">
                                    <tbody>
                                        <tr><td className="py-0.5 pr-3 text-right font-semibold">Total Taxable:</td><td className="py-0.5 text-right">₹{sample.total_taxable.toFixed(2)}</td></tr>
                                        <tr><td className="py-0.5 pr-3 text-right font-semibold">CGST Total:</td><td className="py-0.5 text-right">₹{sample.cgst_total.toFixed(2)}</td></tr>
                                        <tr><td className="py-0.5 pr-3 text-right font-semibold">SGST Total:</td><td className="py-0.5 text-right">₹{sample.sgst_total.toFixed(2)}</td></tr>
                                        <tr className="border-t border-slate-200"><td className="py-0.5 pr-3 text-right font-semibold">Sub Total:</td><td className="py-0.5 text-right">₹{sample.sub_total.toFixed(2)}</td></tr>
                                        <tr><td className="py-0.5 pr-3 text-right font-semibold">Shipping:</td><td className="py-0.5 text-right">₹{parseFloat(settings.default_shipping || '0').toFixed(2)}</td></tr>
                                        <tr className="border-t border-slate-300">
                                            <td className="py-1 pr-3 text-right font-bold text-[11px]">Invoice Total:</td>
                                            <td className="py-1 text-right font-bold text-[11px]">₹{(sample.sub_total + parseFloat(settings.default_shipping || '0')).toFixed(2)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="mt-2 border-t border-slate-200 pt-2">
                                    <p className="font-semibold">Amount in Words:</p>
                                    <p className="text-slate-600 italic">{sample.amount_words}</p>
                                </div>
                            </div>
                            {/* Right: Terms */}
                            <div className="p-3">
                                <p className="font-bold text-[10px] mb-1">Terms & Conditions:</p>
                                <p className="whitespace-pre-line text-slate-600 text-[8px] leading-relaxed">{settings.terms}</p>
                                <p className="font-bold text-[10px] mt-3 mb-1">Declaration:</p>
                                <p className="text-slate-600 text-[8px] leading-relaxed">{settings.declaration}</p>
                            </div>
                        </div>

                        {/* Bank Details */}
                        <div className="bg-[#142F41] text-white p-3 text-[9px]">
                            <p className="font-bold text-[10px] mb-1">Bank Details:</p>
                            <p>Account Name: {settings.bank_account_name}</p>
                            <p>Bank: {settings.bank_name} | A/C No: {settings.bank_ac_no || '{{A/C No}}'}</p>
                            <p>IFSC: {settings.bank_ifsc || '{{IFSC}}'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
