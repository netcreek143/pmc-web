import { useMemo, useState } from 'react';
import { useCartStore } from '../lib/store';
import type { CartState, CartItem } from '../lib/store';
import { formatCurrency, fetcher } from '../lib/api';
import { downloadInvoice } from '../lib/checkout';

const paymentMethods = [
    { id: 'Razorpay', label: 'Razorpay (UPI + Cards)' },
    { id: 'Stripe', label: 'Stripe (Intl Cards)' },
    { id: 'UPI', label: 'UPI' },
    { id: 'COD', label: 'Cash on Delivery' },
];

export default function Checkout() {
    const items = useCartStore((state: CartState) => state.items);
    const clear = useCartStore((state: CartState) => state.clear);
    const [step, setStep] = useState(1);
    const [coupon, setCoupon] = useState('');
    const [payment, setPayment] = useState('Razorpay');
    const [address, setAddress] = useState({
        name: '',
        email: '',
        phone: '',
        address_line: '',
        city: '',
        state: '',
        postal_code: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [order, setOrder] = useState<any>(null);

    const subtotal = useMemo(
        () => items.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0),
        [items]
    );
    const discount = coupon ? subtotal * 0.1 : 0;
    const shipping = subtotal - discount >= 999 ? 0 : 250;
    const gst = (subtotal - discount) * 0.18;
    const total = subtotal - discount + gst + shipping;

    const placeOrder = async () => {
        setSubmitting(true);
        try {
            const payload = {
                customer_name: address.name,
                customer_email: address.email,
                items: items.map((item: CartItem) => ({
                    product_id: item.id,
                    variant_id: null,
                    quantity: item.quantity,
                    price: item.price,
                })),
                address,
                coupon_code: coupon || null,
                payment_method: payment,
            };
            const data = await fetcher('/api/orders-create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            setOrder(data.order);

            const companyDetails = await fetcher('/api/company');

            downloadInvoice({ orderId: data.order.id, items, totals: data.totals, address, companyDetails });
            clear();
            setStep(3);
        } catch (err) {
            console.error('Order error', err);
        } finally {
            setSubmitting(false);
        }
    };

    if (step === 3 && order) {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
                <h1 className="text-2xl font-semibold">Order confirmed!</h1>
                <p className="mt-2 text-sm text-slate-500">Order #{order.id} is confirmed. Invoice downloaded.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-8">
                <div className="flex items-center justify-between text-sm text-slate-500">
                    <span className={step === 1 ? 'text-slate-900 font-semibold' : ''}>Address</span>
                    <span className={step === 2 ? 'text-slate-900 font-semibold' : ''}>Payment</span>
                </div>

                {step === 1 && (
                    <div className="mt-6 space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <input
                                placeholder="Full name"
                                value={address.name}
                                onChange={(event) => setAddress({ ...address, name: event.target.value })}
                                className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
                            />
                            <input
                                placeholder="Email"
                                value={address.email}
                                onChange={(event) => setAddress({ ...address, email: event.target.value })}
                                className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
                            />
                            <input
                                placeholder="Phone"
                                value={address.phone}
                                onChange={(event) => setAddress({ ...address, phone: event.target.value })}
                                className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
                            />
                            <input
                                placeholder="Postal code"
                                value={address.postal_code}
                                onChange={(event) => setAddress({ ...address, postal_code: event.target.value })}
                                className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
                            />
                        </div>
                        <input
                            placeholder="Shipping address"
                            value={address.address_line}
                            onChange={(event) => setAddress({ ...address, address_line: event.target.value })}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                        />
                        <div className="grid gap-4 md:grid-cols-2">
                            <input
                                placeholder="City"
                                value={address.city}
                                onChange={(event) => setAddress({ ...address, city: event.target.value })}
                                className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
                            />
                            <input
                                placeholder="State"
                                value={address.state}
                                onChange={(event) => setAddress({ ...address, state: event.target.value })}
                                className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
                            />
                        </div>
                        <button
                            onClick={() => setStep(2)}
                            className="w-full rounded-full bg-[color:var(--brand)] px-6 py-3 text-sm font-semibold text-white"
                        >
                            Continue to payment
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="mt-6 space-y-4">
                        <div className="space-y-2">
                            {paymentMethods.map((method) => (
                                <button
                                    key={method.id}
                                    onClick={() => setPayment(method.id)}
                                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm ${payment === method.id
                                        ? 'border-[color:var(--brand)] bg-[color:var(--brand)]/10 text-slate-900'
                                        : 'border-slate-200 text-slate-600'
                                        }`}
                                >
                                    {method.label}
                                </button>
                            ))}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800">Coupon code</p>
                            <input
                                value={coupon}
                                onChange={(event) => setCoupon(event.target.value)}
                                placeholder="WELCOME10"
                                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
                            />
                        </div>
                        <button
                            onClick={placeOrder}
                            disabled={submitting}
                            className="mt-2 w-full rounded-full bg-[color:var(--brand)] px-6 py-3 text-sm font-semibold text-white"
                        >
                            {submitting ? 'Processing...' : `Pay ${formatCurrency(total)}`}
                        </button>
                    </div>
                )}
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-semibold">Order summary</h2>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                    {items.map((item: CartItem) => (
                        <div key={item.id} className="flex items-center justify-between">
                            <span>{item.name} × {item.quantity}</span>
                            <span>{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <div className="flex items-center justify-between">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Discount</span>
                        <span>-{formatCurrency(discount)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>GST (18%)</span>
                        <span>{formatCurrency(gst)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
                    </div>
                    <div className="flex items-center justify-between text-base font-semibold text-slate-900">
                        <span>Total</span>
                        <span>{formatCurrency(total)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
