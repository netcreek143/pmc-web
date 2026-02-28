import type { ReactNode } from 'react';

export default function StatsCard({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
        </div>
        <div className="rounded-full bg-slate-100 p-3 text-slate-700">{icon}</div>
      </div>
    </div>
  );
}
