import { useEffect, useState } from 'react';
import { fetcher, formatCurrency } from '../lib/api';
import LoadingState from '../components/LoadingState';
import Modal from '../components/Modal';

export default function AdminCustomers() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);

    const fetchData = async () => {
        try {
            const data = await fetcher('/api/customers');
            setCustomers(data);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateCustomer = async () => {
        await fetcher('/api/customers', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(selected),
        });
        setOpen(false);
        fetchData();
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <LoadingState label="Loading customers" />;

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <h1 className="text-2xl font-semibold text-slate-900">Customer management</h1>
            <div className="mt-6 space-y-3 text-sm text-slate-600">
                {customers.map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3">
                        <div>
                            <p className="font-semibold text-slate-900">{customer.name}</p>
                            <p className="text-xs text-slate-500">{customer.customer_type}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span>{formatCurrency(Number(customer.total_spend))}</span>
                            <button
                                onClick={() => {
                                    setSelected(customer);
                                    setOpen(true);
                                }}
                                className="text-xs text-slate-500"
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <Modal open={open} onClose={() => setOpen(false)} title="Edit customer">
                <div className="space-y-3 text-sm">
                    {selected && (
                        <>
                            <input
                                placeholder="Name"
                                value={selected.name}
                                onChange={(event) => setSelected({ ...selected, name: event.target.value })}
                                className="w-full rounded-xl border border-slate-200 px-4 py-2"
                            />
                            <input
                                placeholder="Type"
                                value={selected.customer_type}
                                onChange={(event) => setSelected({ ...selected, customer_type: event.target.value })}
                                className="w-full rounded-xl border border-slate-200 px-4 py-2"
                            />
                            <button onClick={updateCustomer} className="w-full rounded-full bg-[color:var(--brand)] px-4 py-2 text-white">
                                Save
                            </button>
                        </>
                    )}
                </div>
            </Modal>
        </div>
    );
}
