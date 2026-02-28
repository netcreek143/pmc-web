import { Users, Eye, Send, Ban, Calendar } from 'lucide-react';

export default function AdminEmployee() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-500">
                    <span className="text-[color:var(--brand)] font-medium">Settings</span> /
                    <span className="text-slate-900">Employee Details</span>
                </div>
                <button className="flex items-center gap-2 rounded bg-[#e87c48] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#d46a39]">
                    <Eye size={14} /> View Employee Details
                </button>
            </div>

            <div className="rounded-md border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col items-center justify-center border-b border-slate-200 bg-[#eae6e1] py-4 text-center rounded-t-md">
                    <div className="flex items-center gap-2 text-lg font-bold text-slate-900">
                        <Users size={20} /> Add Employee
                    </div>
                    <p className="text-xs font-semibold text-slate-700 mt-1">Add Employee relevant details here</p>
                </div>

                <div className="p-6 md:p-8 text-sm">
                    <div className="grid gap-x-12 gap-y-6 md:grid-cols-2">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="font-semibold text-slate-700 text-[11px]">Employee Id</label>
                                <input type="text" value="EMP-20260228040654" readOnly className="w-full rounded bg-slate-100 border border-slate-200 px-3 py-2.5 text-xs text-slate-500 focus:outline-none" />
                            </div>

                            <div className="space-y-1.5">
                                <label className="font-semibold text-slate-700 text-[11px]">Employee Name<span className="text-rose-500">*</span></label>
                                <input type="text" placeholder="Enter Name" className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400" />
                            </div>

                            <div className="space-y-1.5">
                                <label className="font-semibold text-slate-700 text-[11px]">Father's Name<span className="text-rose-500">*</span></label>
                                <input type="text" placeholder="Enter Father's Name" className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400" />
                            </div>

                            <div className="space-y-1.5">
                                <label className="font-semibold text-slate-700 text-[11px]">Address<span className="text-rose-500">*</span></label>
                                <input type="text" placeholder="Enter Address" className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400" />
                            </div>

                            <div className="space-y-1.5">
                                <label className="font-semibold text-slate-700 text-[11px]">Qualification<span className="text-rose-500">*</span></label>
                                <input type="text" placeholder="Enter Qualification" className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400" />
                            </div>

                            <div className="space-y-1.5">
                                <label className="font-semibold text-slate-700 text-[11px]">Email ID<span className="text-rose-500">*</span></label>
                                <input type="email" placeholder="Enter Email Id" className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400" />
                            </div>

                            <div className="space-y-1.5">
                                <label className="font-semibold text-slate-700 text-[11px]">Password<span className="text-rose-500">*</span></label>
                                <input type="password" placeholder="Enter Password" className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400" />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="font-semibold text-slate-700 text-[11px]">Upload Logo<span className="text-rose-500">*</span></label>
                                <div className="flex items-center gap-3">
                                    <button className="rounded border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100">Choose file</button>
                                    <span className="text-xs text-slate-500">No file chosen</span>
                                </div>
                                <p className="text-[10px] text-slate-400">No file chosen</p>
                            </div>

                            <div className="space-y-2">
                                <label className="font-semibold text-slate-700 text-[11px]">Gender<span className="text-rose-500">*</span></label>
                                <div className="flex items-center gap-6 mt-1">
                                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                                        <input type="radio" name="gender" className="accent-[color:var(--brand)]" /> Male
                                    </label>
                                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                                        <input type="radio" name="gender" className="accent-[color:var(--brand)]" /> Female
                                    </label>
                                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                                        <input type="radio" name="gender" className="accent-[color:var(--brand)]" /> Others
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-1.5 relative">
                                <label className="font-semibold text-slate-700 text-[11px]">Date Of Birth<span className="text-rose-500">*</span></label>
                                <div className="relative border border-slate-200 rounded">
                                    <input type="text" placeholder="dd/mm/yyyy" className="w-full bg-transparent px-3 py-2 text-xs placeholder-slate-400 outline-none" />
                                    <Calendar size={14} className="absolute right-3 top-2.5 text-slate-400" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="font-semibold text-slate-700 text-[11px]">Mobile Number<span className="text-rose-500">*</span></label>
                                <input type="text" placeholder="Enter Phone Number" className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400" />
                            </div>

                            <div className="space-y-1.5">
                                <label className="font-semibold text-slate-700 text-[11px]">Designation<span className="text-rose-500">*</span></label>
                                <input type="text" placeholder="Enter Designation" className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400" />
                            </div>

                            <div className="space-y-1.5 relative">
                                <label className="font-semibold text-slate-700 text-[11px]">Date Of Join<span className="text-rose-500">*</span></label>
                                <div className="relative border border-slate-200 rounded">
                                    <input type="text" placeholder="dd/mm/yyyy" className="w-full bg-transparent px-3 py-2 text-xs placeholder-slate-400 outline-none" />
                                    <Calendar size={14} className="absolute right-3 top-2.5 text-slate-400" />
                                </div>
                            </div>

                            <div className="space-y-2 pt-2">
                                <label className="font-semibold text-slate-700 text-[11px] mr-3">Documents<span className="text-rose-500">*</span></label>
                                <button className="rounded border border-slate-300 bg-slate-50 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100">Choose files</button>
                                <span className="text-xs text-slate-500 ml-2">No file chosen</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100">
                        <button className="flex items-center gap-2 rounded bg-[#20403e] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#1a3331]">
                            <Send size={14} /> Save
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
