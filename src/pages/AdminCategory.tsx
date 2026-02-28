import { MonitorSmartphone, EyeOff, Send, PlusSquare } from 'lucide-react';

export default function AdminCategory() {
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

            <div className="rounded-md border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-200 bg-[#eae6e1] px-6 py-4 rounded-t-md text-slate-900 font-bold text-base">
                    <MonitorSmartphone size={20} /> Add Category
                </div>

                <div className="flex flex-col items-center justify-center p-12 md:p-24">
                    <div className="w-full max-w-sm space-y-6">
                        <div className="space-y-1.5">
                            <label className="font-semibold text-slate-700 text-[11px]">Category</label>
                            <div className="flex items-center gap-2">
                                <select className="flex-1 rounded border border-slate-200 px-3 py-2 text-xs text-slate-500 bg-white">
                                    <option>Select</option>
                                </select>
                                <button className="rounded bg-slate-200 p-1.5 text-slate-600 hover:bg-slate-300 transition">
                                    <PlusSquare size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="font-semibold text-slate-700 text-[11px]">Subcategory</label>
                            <input type="text" className="w-full rounded border border-slate-200 px-3 py-2 text-xs" />
                        </div>

                        <div className="pt-4 flex justify-center">
                            <button className="flex items-center gap-2 rounded bg-[#20403e] px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-[#1a3331]">
                                <Send size={14} /> Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
