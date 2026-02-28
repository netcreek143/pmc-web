import supabase from './_supabase.js';

function calculateTotals(items, coupon) {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = coupon
        ? coupon.discount_type === 'percentage'
            ? subtotal * (Number(coupon.value) / 100)
            : Number(coupon.value)
        : 0;
    const shipping = subtotal - discount >= 999 ? 0 : 250;
    const taxable = subtotal - discount;
    const gst = taxable * 0.18;
    const total = taxable + gst + shipping;
    return { subtotal, discount, shipping, gst, total };
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(204).end();

    try {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' });
        }
        const { customer_name, customer_email, items, address, coupon_code, payment_method } = req.body;
        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Order items required' });
        }

        let coupon = null;
        if (coupon_code) {
            const { data: couponData } = await supabase.from('coupons').select('*').eq('code', coupon_code).single();
            if (couponData) coupon = couponData;
        }

        const totals = calculateTotals(items, coupon);

        const { data: order, error } = await supabase
            .from('orders')
            .insert({
                customer_name,
                customer_email,
                status: 'Pending',
                subtotal: totals.subtotal,
                tax: totals.gst,
                shipping: totals.shipping,
                discount: totals.discount,
                total: totals.total,
            })
            .select()
            .single();
        if (error) throw error;

        const orderItems = items.map((item) => ({
            order_id: order.id,
            product_id: item.product_id,
            variant_id: item.variant_id || null,
            quantity: item.quantity,
            price: item.price,
        }));
        const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
        if (itemsError) throw itemsError;

        if (address) {
            const { error: addressError } = await supabase.from('order_addresses').insert({ order_id: order.id, ...address });
            if (addressError) throw addressError;
        }

        if (payment_method) {
            const { error: paymentError } = await supabase.from('order_payments').insert({
                order_id: order.id,
                method: payment_method,
                status: 'initiated',
                transaction_id: `demo_${Date.now()}`,
            });
            if (paymentError) throw paymentError;
        }

        return res.status(201).json({ order, totals });
    } catch (err) {
        console.error('API error:', err);
        res.status(500).json({ error: err.message });
    }
}
