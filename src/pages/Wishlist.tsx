import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetcher, formatCurrency } from '../lib/api';
import { useAuthStore } from '../lib/store';
import type { AuthState } from '../lib/store';
import LoadingState from '../components/LoadingState';

type WishlistItem = {
    id: number;
    product_id: number;
    customer_email: string;
};

type Product = {
    id: number;
    name: string;
    price: number;
    sale_price: number;
    stock: number;
    primary_image_url: string;
    category_id: number;
};

export default function Wishlist() {
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const token = useAuthStore((state: AuthState) => state.token);

    const fetchData = async (email: string) => {
        try {
            const [wishlistData, productData] = await Promise.all([
                fetcher(`/api/wishlist?customer_email=${encodeURIComponent(email)}`),
                fetcher('/api/products?status=published'),
            ]);
            setItems(wishlistData);
            setProducts(productData);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }
        // Decode email from JWT payload
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.email) {
                fetchData(payload.email);
            } else {
                setLoading(false);
            }
        } catch {
            setLoading(false);
        }
    }, [token]);

    if (loading) return <LoadingState label="Loading wishlist" />;

    if (!token) {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
                <h1 className="text-2xl font-semibold text-slate-900">Your wishlist</h1>
                <p className="mt-2 text-sm text-slate-500">Please log in to view your saved items.</p>
                <Link to="/login" className="mt-6 inline-flex rounded-full bg-[color:var(--brand)] px-6 py-3 text-sm font-semibold text-white">
                    Log in
                </Link>
            </div>
        );
    }

    const mapped = items.map((item: WishlistItem) => ({
        ...item,
        product: products.find((product: Product) => product.id === item.product_id),
    }));

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-slate-900">Wishlist</h1>
            {mapped.length === 0 && (
                <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
                    <p className="text-sm text-slate-500">No saved items yet.</p>
                    <Link to="/shop" className="mt-6 inline-flex rounded-full bg-[color:var(--brand)] px-6 py-3 text-sm font-semibold text-white">
                        Browse shop
                    </Link>
                </div>
            )}
            <div className="grid gap-6 md:grid-cols-2">
                {mapped.map((item: WishlistItem & { product?: Product }) => (
                    <Link key={item.id} to={`/product/${item.product_id}`} className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="flex items-center gap-4">
                            <img src={item.product?.primary_image_url} alt={item.product?.name} className="h-20 w-20 rounded-xl object-cover" />
                            <div>
                                <p className="text-sm font-semibold text-slate-900">{item.product?.name}</p>
                                <p className="mt-2 text-sm text-slate-600">{formatCurrency(item.product?.sale_price || item.product?.price || 0)}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
