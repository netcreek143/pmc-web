import { useState, useEffect } from 'react';
import { Users, Eye, Send, Ban, Plus, Trash2, Loader2, CheckCircle, X } from 'lucide-react';
import { fetcher } from '../lib/api';
import { useNotificationStore } from '../lib/notificationStore';

type Employee = {
    id: string;
    employee_id: string;
    name: string;
    designation: string;
    email: string;
    mobile: string;
    status: string;
    join_date: string;
};

export default function AdminEmployee() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'list' | 'add'>('list');
    const [saving, setSaving] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteResult, setDeleteResult] = useState<'success' | 'error' | null>(null);
    const showNotification = useNotificationStore(state => state.show);

    const [formData, setFormData] = useState({
        name: '',
        father_name: '',
        address: '',
        qualification: '',
        email: '',
        gender: 'Male',
        dob: '',
        mobile: '',
        designation: '',
        join_date: new Date().toISOString().split('T')[0],
        username: '',
        password: '',
        permissions: [] as string[]
    });

    const sections = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'employees', label: 'Employee Details' },
        { id: 'categories', label: 'Categories' },
        { id: 'products_add', label: 'Add Products' },
        { id: 'products_list', label: 'Products List' },
        { id: 'customers', label: 'Customers' },
        { id: 'orders', label: 'Orders' },
        { id: 'invoice_settings', label: 'Invoice Settings' },
        { id: 'coupons', label: 'Coupons' },
        { id: 'campaign', label: 'Campaign' },
        { id: 'reviews', label: 'Reviews' },
        { id: 'customize', label: 'Customize' },
        { id: 'content_cms', label: 'Content CMS' },
        { id: 'reports', label: 'Reports' }
    ];

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await fetcher('/api/employees');
            setEmployees(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const togglePermission = (id: string) => {
        setFormData(prev => ({
            ...prev,
            permissions: prev.permissions.includes(id)
                ? prev.permissions.filter(p => p !== id)
                : [...prev.permissions, id]
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const employee_id = `EMP-${Date.now()}`;
            // In a real app, hash password on backend. For now sending as is for API to handle.
            await fetcher('/api/employees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, employee_id }),
            });
            showNotification('Employee added successfully', 'success');
            setView('list');
            fetchData();
        } catch (err: any) {
            showNotification(err.message || 'Failed to add employee', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        setDeleteResult(null);
        try {
            await fetcher('/api/employees', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: deleteId }),
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-500">
                    <span className="text-[color:var(--brand)] font-medium">Home</span> /
                    <span className="text-slate-900">Employees</span>
                </div>
                <button
                    onClick={() => setView(view === 'list' ? 'add' : 'list')}
                    className="flex items-center gap-2 rounded bg-[color:var(--brand)] px-4 py-2 text-xs font-semibold text-white transition opacity-90 hover:opacity-100"
                >
                    {view === 'list' ? <><Plus size={14} /> Add Employee</> : <><Eye size={14} /> View List</>}
                </button>
            </div>

            {view === 'list' ? (
                <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="border-b border-slate-200 bg-[#eae6e1] px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users size={20} className="text-slate-800" />
                            <h2 className="text-lg font-bold text-slate-800">Employee Directory</h2>
                        </div>
                    </div>

                    <div className="p-0 overflow-x-auto">
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 size={24} className="animate-spin text-slate-300" />
                            </div>
                        ) : (
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-700 uppercase font-semibold">
                                    <tr>
                                        <th className="px-6 py-3">ID</th>
                                        <th className="px-6 py-3">Name / Role</th>
                                        <th className="px-6 py-3">Contact</th>
                                        <th className="px-6 py-3">Joined</th>
                                        <th className="px-6 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {employees.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-slate-400">No employees found</td>
                                        </tr>
                                    ) : (
                                        employees.map((emp) => (
                                            <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-slate-500 uppercase">{emp.employee_id}</td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-slate-900">{emp.name}</div>
                                                    <div className="text-[10px] text-slate-500">{emp.designation}</div>
                                                    <div className="mt-1 flex flex-wrap gap-1">
                                                        {(emp as any).permissions?.map((p: string) => (
                                                            <span key={p} className="bg-slate-100 text-[8px] px-1.5 py-0.5 rounded uppercase font-bold text-slate-500">{p}</span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-slate-600">{emp.email}</div>
                                                    <div className="text-[10px] text-slate-400">{emp.mobile}</div>
                                                    {(emp as any).username && <div className="text-[9px] text-emerald-600 font-bold mt-1">ID: {(emp as any).username}</div>}
                                                </td>
                                                <td className="px-6 py-4 text-slate-500">
                                                    {emp.join_date ? new Date(emp.join_date).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => setDeleteId(emp.id)}
                                                        className="text-slate-300 hover:text-rose-600 transition"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            ) : (
                <div className="rounded-md border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col items-center justify-center border-b border-slate-200 bg-[#eae6e1] py-4 text-center rounded-t-md">
                        <div className="flex items-center gap-2 text-lg font-bold text-slate-900">
                            <Plus size={20} /> Add New Employee
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 md:p-8 text-sm">
                        <div className="grid gap-x-12 gap-y-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                                    <Users size={16} /> Basic Information
                                </h3>
                                <div className="space-y-1.5">
                                    <label className="font-semibold text-slate-700 text-[11px]">Full Name *</label>
                                    <input required name="name" value={formData.name} onChange={handleChange} type="text" placeholder="Enter Name" className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="font-semibold text-slate-700 text-[11px]">Email ID *</label>
                                    <input required name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Enter Email Id" className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="font-semibold text-slate-700 text-[11px]">Mobile Number</label>
                                        <input name="mobile" value={formData.mobile} onChange={handleChange} type="text" placeholder="Enter Mobile" className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="font-semibold text-slate-700 text-[11px]">Designation</label>
                                        <input name="designation" value={formData.designation} onChange={handleChange} type="text" placeholder="e.g. Manager" className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400" />
                                    </div>
                                </div>

                                <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 pt-4 flex items-center gap-2">
                                    <Eye size={16} /> Access Credentials
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="font-semibold text-slate-700 text-[11px]">Login ID (Username)</label>
                                        <input name="username" value={formData.username} onChange={handleChange} type="text" placeholder="e.g. staff_01" className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="font-semibold text-slate-700 text-[11px]">Password</label>
                                        <input name="password" value={formData.password} onChange={handleChange} type="password" placeholder="••••••••" className="w-full rounded border border-slate-200 px-3 py-2 text-xs placeholder-slate-400" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                                    <Ban size={16} /> Section Permissions
                                </h3>
                                <p className="text-[10px] text-slate-400 mb-3 italic">Check the boxes to allow this employee to see specific admin sections.</p>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                    {sections.map(s => (
                                        <label key={s.id} className="flex items-center gap-2 p-2 rounded border border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={formData.permissions.includes(s.id)}
                                                onChange={() => togglePermission(s.id)}
                                                className="rounded border-slate-300 text-[color:var(--brand)] focus:ring-[color:var(--brand)]"
                                            />
                                            <span className="text-[11px] font-medium text-slate-600">{s.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100">
                            <button type="submit" disabled={saving} className="flex items-center gap-2 rounded bg-[#20403e] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#1a3331] disabled:opacity-50">
                                {saving ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                Save Employee & Permissions
                            </button>
                            <button type="button" onClick={() => setView('list')} className="flex items-center gap-2 rounded bg-[#891630] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#6d1126]">
                                <Ban size={14} /> Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Delete Modal */}
            {deleteId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl text-center">
                        {deleteResult === 'success' ? (
                            <>
                                <CheckCircle size={40} className="mx-auto text-emerald-500 mb-3" />
                                <h3 className="text-lg font-semibold text-slate-900">Success!</h3>
                                <p className="text-sm text-slate-500 mt-2">Employee deleted successfully.</p>
                                <button
                                    onClick={() => {
                                        setDeleteId(null);
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
                                <p className="text-sm text-slate-500 mt-2">Failed to delete the employee. Please try again.</p>
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
                                <p className="text-sm text-slate-500 mt-2">Please wait while we remove this employee.</p>
                            </>
                        ) : (
                            <>
                                <Trash2 size={32} className="mx-auto text-rose-500 mb-3" />
                                <h3 className="text-lg font-semibold text-slate-900">Delete Employee?</h3>
                                <p className="text-sm text-slate-500 mt-2">Are you sure you want to delete this employee? This action cannot be undone.</p>
                                <div className="flex gap-3 mt-5 justify-center">
                                    <button onClick={() => setDeleteId(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
                                    <button onClick={handleDelete} className="rounded-lg bg-rose-600 px-4 py-2 text-sm text-white hover:bg-rose-700">Yes, Delete</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
