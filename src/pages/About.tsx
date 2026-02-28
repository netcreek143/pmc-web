import { useEffect, useState } from 'react';
import { fetcher } from '../lib/api';
import LoadingState from '../components/LoadingState';

type CMS = { id: number; key: string; title: string; content: string; image_url: string };

export default function About() {
  const [data, setData] = useState<CMS | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    try {
      const cms = await fetcher('/api/cms-content');
      setData(cms.find((item: CMS) => item.key === 'about'));
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  if (loading) return <LoadingState label="Loading about" />;
  if (!data) return null;

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_1.1fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">About</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">{data.title}</h1>
        <p className="mt-4 text-sm text-slate-600">{data.content}</p>
      </div>
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <img src={data.image_url} alt={data.title} className="h-full w-full object-cover" />
      </div>
    </div>
  );
}
