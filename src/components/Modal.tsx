import { X } from 'lucide-react';

export default function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg'
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className={`w-full ${maxWidth} rounded-lg bg-white p-6 shadow-xl relative`}>
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">{title}</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-slate-100 transition shadow-sm border border-slate-100">
            <X size={18} className="text-slate-500" />
          </button>
        </div>
        <div className="mt-0">{children}</div>
      </div>
    </div>
  );
}
