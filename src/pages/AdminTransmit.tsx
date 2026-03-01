import { Truck, Send, Eye } from 'lucide-react';

export default function AdminTransmit() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="text-blue-500 hover:underline cursor-pointer">Home</span>
                    <span>/</span>
                    <span className="text-blue-500 hover:underline cursor-pointer">Transmit</span>
                    <span>/</span>
                    <span className="text-slate-700">Transmit Charges Details</span>
                </div>
                <button className="flex items-center gap-2 rounded bg-[#e87731] px-4 py-2 text-sm font-medium text-white hover:bg-[#d66826] transition-colors">
                    <Eye size={16} />
                    View Transmit details
                </button>
            </div>

            {/* Main Card */}
            <div className="rounded-lg bg-white shadow-sm border border-slate-100 overflow-hidden">
                <div className="border-b border-slate-200 bg-[#ebe9e1] px-6 py-4 flex items-center gap-2">
                    <Truck size={20} className="text-slate-800" />
                    <h2 className="text-lg font-bold text-slate-800">Add Transmit Charges</h2>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Select State</label>
                            <input
                                type="text"
                                placeholder="Select State"
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Price per Kg ($)</label>
                            <input
                                type="text"
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                            />
                        </div>

                        <div>
                            <button className="flex items-center justify-center gap-2 rounded bg-[#1e4438] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#153128] transition-colors w-32 shadow-sm">
                                <Send size={16} />
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
