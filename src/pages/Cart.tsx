import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../lib/store';
import { formatCurrency } from '../lib/api';

export default function Cart() {
    const { items, updateQty, removeItem } = useCartStore();
    const subtotal = useMemo(
        () => items.reduce((sum: number, item) => sum + item.price * item.quantity, 0),
        [items]
    );
    const shipping = subtotal >= 999 ? 0 : 250;

    if (items.length === 0) {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
                <h1 className="text-2xl font-semibold">Your cart is empty</h1>
                <p className="mt-2 text-sm text-slate-500">Discover premium packaging for your next bake.</p>
                <Link
                    to="/shop"
                    className="mt-6 inline-flex rounded-full bg-[color:var(--brand)] px-6 py-3 text-sm font-semibold text-white"
                >
                    Browse shop
                </Link>
            </div>
        );
    }

    return (
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item.id} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4">
                        <img src={item.image} alt={item.name} className="h-24 w-24 rounded-xl object-cover" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-slate-900">{item.name}</h3>
                            <p className="mt-2 text-sm text-slate-500">{formatCurrency(item.price)}</p>
                            <div className="mt-4 flex items-center gap-3">
                                <input
                                    type="number"
                                    min={1}
                                    value={item.quantity}
                                    onChange={(event) => updateQty(item.id, Number(event.target.value))}
                                    className="w-20 rounded-full border border-slate-200 px-3 py-1 text-sm"
                                />
                                <button onClick={() => removeItem(item.id)} className="text-xs text-rose-500">
                                    Remove
                                </button>
                            </div>
                        </div>
                        <p className="text-sm font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                ))}
            </div>
            <div className="h-fit rounded-3xl border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-semibold">Order summary</h2>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <div className="flex items-center justify-between">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>GST (18%)</span>
                        <span>{formatCurrency(subtotal * 0.18)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(subtotal * 1.18 + shipping)}</span>
                </div>
                <Link
                    to="/checkout"
                    className="mt-6 flex w-full justify-center rounded-full bg-[color:var(--brand)] px-6 py-3 text-sm font-semibold text-white"
                >
                    Proceed to checkout
                </Link>
            </div>
        </div>
    );
}
