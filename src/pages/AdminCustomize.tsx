import React from 'react';
import { Monitor, Image as ImageIcon } from 'lucide-react';

export default function AdminCustomize() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="text-blue-500 hover:underline cursor-pointer">Home</span>
                <span>/</span>
                <span className="text-blue-500 hover:underline cursor-pointer">Customize</span>
                <span>/</span>
                <span className="text-slate-700">View Customize</span>
            </div>

            {/* Main Card */}
            <div className="rounded-lg bg-white shadow-sm border border-slate-100 overflow-hidden">
                <div className="border-b border-slate-200 bg-[#ebe9e1] px-6 py-4 flex items-center gap-2">
                    <Monitor size={20} className="text-slate-800" />
                    <h2 className="text-lg font-bold text-slate-800">View Customize Enquiry</h2>
                </div>

                <div className="p-4 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span>Show</span>
                            <select className="border border-slate-300 rounded px-2 py-1 focus:outline-none focus:border-brand">
                                <option>10</option>
                                <option>25</option>
                                <option>50</option>
                            </select>
                            <span>entries</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span>Search:</span>
                            <input
                                type="text"
                                className="border border-slate-300 rounded px-3 py-1 focus:outline-none focus:border-brand"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-slate-200 text-sm whitespace-nowrap">
                            <thead>
                                <tr className="bg-[#4CAF50] text-white">
                                    <th className="border border-slate-200 px-4 py-3 text-left font-bold cursor-pointer hover:bg-[#45a049]">S.No &#8597;</th>
                                    <th className="border border-slate-200 px-4 py-3 text-left font-bold cursor-pointer hover:bg-[#45a049]">First Name &#8597;</th>
                                    <th className="border border-slate-200 px-4 py-3 text-left font-bold cursor-pointer hover:bg-[#45a049]">Last Name &#8597;</th>
                                    <th className="border border-slate-200 px-4 py-3 text-left font-bold cursor-pointer hover:bg-[#45a049]">Email &#8597;</th>
                                    <th className="border border-slate-200 px-4 py-3 text-left font-bold cursor-pointer hover:bg-[#45a049]">Phone &#8597;</th>
                                    <th className="border border-slate-200 px-4 py-3 text-left font-bold cursor-pointer hover:bg-[#45a049]">Company &#8597;</th>
                                    <th className="border border-slate-200 px-4 py-3 text-left font-bold cursor-pointer hover:bg-[#45a049]">Website &#8597;</th>
                                    <th className="border border-slate-200 px-4 py-3 text-left font-bold cursor-pointer hover:bg-[#45a049]">Packing Items &#8597;</th>
                                    <th className="border border-slate-200 px-4 py-3 text-left font-bold cursor-pointer hover:bg-[#45a049]">Dimensions &#8597;</th>
                                    <th className="border border-slate-200 px-4 py-3 text-left font-bold cursor-pointer hover:bg-[#45a049]">Box Type &#8597;</th>
                                    <th className="border border-slate-200 px-4 py-3 text-left font-bold cursor-pointer hover:bg-[#45a049]">Box Content &#8597;</th>
                                    <th className="border border-slate-200 px-4 py-3 text-left font-bold text-white">Image</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="hover:bg-slate-50">
                                    <td className="border border-slate-200 px-4 py-3">1</td>
                                    <td className="border border-slate-200 px-4 py-3">Ananda</td>
                                    <td className="border border-slate-200 px-4 py-3">Kumaran</td>
                                    <td className="border border-slate-200 px-4 py-3">anand02111998@gmail.com</td>
                                    <td className="border border-slate-200 px-4 py-3">9894820383</td>
                                    <td className="border border-slate-200 px-4 py-3">Sm infotech</td>
                                    <td className="border border-slate-200 px-4 py-3 text-blue-500 hover:underline">https://sminfo.in/</td>
                                    <td className="border border-slate-200 px-4 py-3">150</td>
                                    <td className="border border-slate-200 px-4 py-3">10*50</td>
                                    <td className="border border-slate-200 px-4 py-3">Cake Box</td>
                                    <td className="border border-slate-200 px-4 py-3">Tell me anything</td>
                                    <td className="border border-slate-200 px-4 py-3 p-1">
                                        <div className="w-12 h-12 bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                                            <ImageIcon size={20} />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-600">
                        <div>Showing 1 to 1 of 1 entries</div>
                        <div className="flex items-center gap-1">
                            <button className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 cursor-not-allowed opacity-50">Previous</button>
                            <button className="px-3 py-1 rounded bg-blue-500 text-white">1</button>
                            <button className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 cursor-not-allowed opacity-50">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
