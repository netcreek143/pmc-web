import { useEffect, useState } from 'react';
import { fetcher } from '../lib/api';
import LoadingState from '../components/LoadingState';
import Modal from '../components/Modal';

export default function AdminContent() {
    const [content, setContent] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);

    const fetchData = async () => {
        try {
            const data = await fetcher('/api/cms-content');
            setContent(data);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const saveContent = async () => {
        await fetcher('/api/cms-content', {
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

    if (loading) return <LoadingState label="Loading CMS" />;

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <h1 className="text-2xl font-semibold text-slate-900">CMS content</h1>
            <div className="mt-6 space-y-3 text-sm text-slate-600">
                {content.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-slate-900">{item.title}</p>
                                <p className="text-xs text-slate-500">Key: {item.key}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setSelected(item);
                                    setOpen(true);
                                }}
                                className="text-xs text-slate-500"
                            >
                                Edit
                            </button>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">{item.content}</p>
                    </div>
                ))}
            </div>
            <Modal open={open} onClose={() => setOpen(false)} title="Edit content">
                {selected && (
                    <div className="space-y-3 text-sm">
                        <input
                            placeholder="Title"
                            value={selected.title}
                            onChange={(event) => setSelected({ ...selected, title: event.target.value })}
                            className="w-full rounded-xl border border-slate-200 px-4 py-2"
                        />
                        <textarea
                            placeholder="Content"
                            value={selected.content}
                            onChange={(event) => setSelected({ ...selected, content: event.target.value })}
                            className="h-28 w-full rounded-xl border border-slate-200 px-4 py-2"
                        />
                        <button onClick={saveContent} className="w-full rounded-full bg-[color:var(--brand)] px-4 py-2 text-white">
                            Save
                        </button>
                    </div>
                )}
            </Modal>
        </div>
    );
}
