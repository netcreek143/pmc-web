import { create } from 'zustand';

export type CartItem = {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
};

export type CartState = {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    updateQty: (id: number, qty: number) => void;
    removeItem: (id: number) => void;
    clear: () => void;
};

export type AuthState = {
    token: string | null;
    setToken: (token: string | null) => void;
};

type SetState<T> = (partial: T | Partial<T> | ((state: T) => T | Partial<T>)) => void;

export const useCartStore = create<CartState>((set: SetState<CartState>) => ({
    items: [],
    addItem: (item: CartItem) =>
        set((state: CartState) => {
            const existing = state.items.find((entry) => entry.id === item.id);
            if (existing) {
                return {
                    items: state.items.map((entry) =>
                        entry.id === item.id ? { ...entry, quantity: entry.quantity + item.quantity } : entry
                    ),
                };
            }
            return { items: [...state.items, item] };
        }),
    updateQty: (id: number, qty: number) =>
        set((state: CartState) => ({ items: state.items.map((entry) => (entry.id === id ? { ...entry, quantity: qty } : entry)) })),
    removeItem: (id: number) => set((state: CartState) => ({ items: state.items.filter((entry) => entry.id !== id) })),
    clear: () => set({ items: [] }),
}));

export const useAuthStore = create<AuthState>((set: SetState<AuthState>) => ({
    token: typeof window === 'undefined' ? null : localStorage.getItem('pmc_token'),
    setToken: (token: string | null) => {
        if (token) {
            localStorage.setItem('pmc_token', token);
        } else {
            localStorage.removeItem('pmc_token');
        }
        set({ token });
    },
}));
