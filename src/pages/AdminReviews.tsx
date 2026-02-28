import React from 'react';
import { Star } from 'lucide-react';

export default function AdminReviews() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="text-blue-500 hover:underline cursor-pointer">Home</span>
                <span>/</span>
                <span className="text-blue-500 hover:underline cursor-pointer">Reviews</span>
                <span>/</span>
                <span className="text-slate-700">View Reviews</span>
            </div>

            {/* Main Card */}
            <div className="rounded-lg bg-white shadow-sm border border-slate-100 overflow-hidden">
                <div className="border-b border-slate-200 bg-[#ebe9e1] px-6 py-4 flex items-center gap-2">
                    <Star size={20} className="text-slate-800" />
                    <h2 className="text-lg font-bold text-slate-800">View Reviews</h2>
                </div>

                <div className="p-4">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-slate-200 text-sm">
                            <thead>
                                <tr className="bg-slate-100">
                                    <th className="border border-slate-200 px-4 py-3 text-left font-bold text-slate-700 w-16">#</th>
                                    <th className="border border-slate-200 px-4 py-3 text-left font-bold text-slate-700">Name</th>
                                    <th className="border border-slate-200 px-4 py-3 text-left font-bold text-slate-700">Email</th>
                                    <th className="border border-slate-200 px-4 py-3 text-left font-bold text-slate-700">Comment</th>
                                    <th className="border border-slate-200 px-4 py-3 text-left font-bold text-slate-700 w-32">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan={5} className="border border-slate-200 px-4 py-4 text-center text-slate-500">
                                        No reviews found
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
