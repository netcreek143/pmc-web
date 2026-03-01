import { create } from 'zustand';

type NotificationType = 'success' | 'error' | 'info';

interface NotificationState {
    message: string | null;
    type: NotificationType;
    show: (message: string, type?: NotificationType, duration?: number) => void;
    hide: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    message: null,
    type: 'success',
    show: (message, type = 'success', duration = 5000) => {
        set({ message, type });
        setTimeout(() => {
            set({ message: null });
        }, duration);
    },
    hide: () => set({ message: null }),
}));
