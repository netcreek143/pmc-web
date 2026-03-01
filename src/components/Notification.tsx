import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useNotificationStore } from '../lib/notificationStore';

export default function Notification() {
    const { message, type, hide } = useNotificationStore();

    if (!message) return null;

    const icons = {
        success: <CheckCircle className="text-emerald-500" size={18} />,
        error: <XCircle className="text-rose-500" size={18} />,
        info: <Info className="text-blue-500" size={18} />
    };

    const bgColors = {
        success: 'bg-emerald-50 border-emerald-100',
        error: 'bg-rose-50 border-rose-100',
        info: 'bg-blue-50 border-blue-100'
    };

    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -20, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: -20, x: '-50%' }}
                    className={`fixed top-6 left-1/2 z-[100] flex min-w-[300px] items-center gap-3 rounded-lg border p-4 shadow-lg ${bgColors[type]}`}
                >
                    {icons[type]}
                    <p className="flex-1 text-sm font-medium text-slate-800">{message}</p>
                    <button onClick={hide} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={16} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
