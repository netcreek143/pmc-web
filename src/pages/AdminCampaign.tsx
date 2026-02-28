import React from 'react';
import { Download, Flame } from 'lucide-react';

export default function AdminCampaign() {
    const campaigns = [
        { id: 1, first: 'Sakthi', last: 'K', email: 'sakthiprakash403@gmail.com', contact: '9790362056', address: '1f3 , vasantham flats, Chennai' },
        { id: 2, first: 'Rathi', last: 'dhanyaa J', email: 'rathidhanyaajaganathan@gmail.com', contact: '7598285777', address: '33, Anthoniyar kovil street.Old kuyavar palayam road, Madurai' },
        { id: 3, first: 'Test', last: '1', email: 'test@gmail.com', contact: '01234567867', address: '1st Street, ch' },
        { id: 4, first: 'Rohith', last: 'Dinesh', email: 'rohithbrutus5@gmail.com', contact: '8608670509', address: 'summa onnu, Madurai' },
        { id: 5, first: 'SURIYA', last: 'S', email: 'packmycake@gmail.com', contact: '09791195777', address: '144, 1st Main Rd, behind World Trade Center, Phase-1,, Madurai' },
        { id: 6, first: 'SURIYA', last: 'S', email: 'sekarsuriya70700@gmail.com', contact: '7010015840', address: 'A164 SHANTHINIKETAN APPARTMENTS, Madurai' },
        { id: 7, first: 'purushothaman', last: 'purushothaman', email: 'dreamspurus2002@gmail.com', contact: '09789340024', address: 'company, MADURAI' },
        { id: 8, first: 'Jamie', last: 'Madhu', email: 'sminfomdu@gmail.com', contact: '9997847474', address: '39/3a BB Road, Sundaraja Puram, Madurai' },
        { id: 9, first: 'Suriya', last: 'Sekar', email: 'sekarsuriya13@gmail.com', contact: '7010015840', address: 'Anna nagar madurai, Madurai' },
        { id: 10, first: 'Ananda', last: 'Kumaran', email: 'anand02111998@gmail.com', contact: '9894820383', address: '3A/102/2-Kamaraj Nagar,Mappillaiyurani, Thoothukudi' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="text-blue-500 hover:underline cursor-pointer">Home</span>
                    <span>/</span>
                    <span className="text-blue-500 hover:underline cursor-pointer">Campaign</span>
                    <span>/</span>
                    <span className="text-slate-700">Campaigns</span>
                </div>
                <button className="flex items-center gap-2 rounded bg-[#1e4438] px-4 py-2 text-sm font-medium text-white hover:bg-[#153128] transition-colors">
                    <Download size={16} />
                    Download Excel
                </button>
            </div>

            {/* Main Card */}
            <div className="rounded-lg bg-white shadow-sm border border-slate-100 overflow-hidden">
                <div className="border-b border-slate-200 bg-[#ebe9e1] px-6 py-4 flex items-center gap-2">
                    <Flame size={20} className="text-slate-800" />
                    <h2 className="text-lg font-bold text-slate-800">Campaigns</h2>
                </div>

                <div className="p-4">
                    <input
                        type="text"
                        placeholder="Search name, email, phone, city..."
                        className="w-full rounded border border-slate-300 px-4 py-2.5 text-sm focus:border-brand focus:outline-none mb-4"
                    />

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-slate-200 text-sm">
                            <thead>
                                <tr className="bg-slate-50">
                                    <th className="border border-slate-200 px-4 py-3 text-left font-bold text-slate-700">#</th>
                                    <th className="border border-slate-200 px-4 py-3 text-left font-bold text-slate-700">FIRST NAME</th>
                                    <th className="border border-slate-200 px-4 py-3 text-left font-bold text-slate-700">LAST NAME</th>
                                    <th className="border border-slate-200 px-4 py-3 text-left font-bold text-slate-700">EMAIL</th>
                                    <th className="border border-slate-200 px-4 py-3 text-left font-bold text-slate-700">CONTACT</th>
                                    <th className="border border-slate-200 px-4 py-3 text-left font-bold text-slate-700">ADDRESS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {campaigns.map((row) => (
                                    <tr key={row.id} className="hover:bg-slate-50">
                                        <td className="border border-slate-200 px-4 py-3">{row.id}</td>
                                        <td className="border border-slate-200 px-4 py-3">{row.first}</td>
                                        <td className="border border-slate-200 px-4 py-3">{row.last}</td>
                                        <td className="border border-slate-200 px-4 py-3">{row.email}</td>
                                        <td className="border border-slate-200 px-4 py-3">{row.contact}</td>
                                        <td className="border border-slate-200 px-4 py-3">{row.address}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end mt-4">
                        <button className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm">1</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
