export default function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-sm text-slate-500">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
      <p className="mt-4">{label}</p>
    </div>
  );
}
