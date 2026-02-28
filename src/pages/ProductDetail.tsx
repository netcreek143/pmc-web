import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetcher, formatCurrency } from '../lib/api';
import LoadingState from '../components/LoadingState';
import { useCartStore } from '../lib/store';
import type { CartState } from '../lib/store';

type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    sale_price: number;
    primary_image_url: string;
    stock: number;
    custom_printing: boolean;
    category_id: number;
};

type Variant = {
    id: number;
    size: string;
    color: string;
    price: number;
    stock: number;
};

type Tier = {
    id: number;
    min_qty: number;
    max_qty: number;
    price_per_unit: number;
};

type Review = {
    id: number;
    customer_name: string;
    rating: number;
    comment: string;
};

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [variants, setVariants] = useState<Variant[]>([]);
    const [tiers, setTiers] = useState<Tier[]>([]);
    const [images, setImages] = useState<any[]>([]);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [reviews, setReviews] = useState<Review[]>([]);
    const [related, setRelated] = useState<Product[]>([]);
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
    const [qty, setQty] = useState(10);
    const [loading, setLoading] = useState(true);
    const addItem = useCartStore((state: CartState) => state.addItem);

    const fetchData = async () => {
        try {
            const productData = await fetcher('/api/products?status=published');
            const selected = productData.find((item: Product) => item.id === Number(id));
            setProduct(selected || null);
            if (selected) {
                const [variantData, tierData, imageData, reviewData] = await Promise.all([
                    fetcher(`/api/product-variants?product_id=${selected.id}`),
                    fetcher(`/api/bulk-pricing?product_id=${selected.id}`),
                    fetcher(`/api/product-images?product_id=${selected.id}`),
                    fetcher(`/api/reviews?product_id=${selected.id}`),
                ]);
                setVariants(variantData);
                setTiers(tierData);
                setImages(imageData);
                setSelectedImage(imageData[0]?.image_url || selected.primary_image_url);
                setReviews(reviewData);
                setSelectedVariant(variantData[0] || null);
                setRelated(productData.filter((item: Product) => item.category_id === selected.category_id && item.id !== selected.id));
            }
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    if (loading) return <LoadingState label="Loading product" />;
    if (!product) return <div className="rounded-2xl border border-slate-200 bg-white p-8">Product not found.</div>;

    const price = selectedVariant?.price || product.sale_price || product.price;

    // Parse description and specification from combined field
    const [desc, spec] = product.description?.includes('|||SPEC|||')
        ? product.description.split('|||SPEC|||')
        : [product.description || '', ''];

    return (
        <div className="space-y-10">
            <div className="grid gap-10 md:grid-cols-2">
                <div className="space-y-4">
                    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
                        <img src={selectedImage || product.primary_image_url} alt={product.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex gap-3">
                        {[product.primary_image_url, ...images.map((img) => img.image_url)].map((img) => (
                            <button
                                key={img}
                                onClick={() => setSelectedImage(img)}
                                className={`h-16 w-16 overflow-hidden rounded-xl border ${selectedImage === img ? 'border-[color:var(--brand)]' : 'border-slate-200'
                                    }`}
                            >
                                <img src={img} alt="thumb" className="h-full w-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>
                <div className="space-y-6">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{product.custom_printing ? 'Custom printing' : 'Ready stock'}</p>
                        <h1 className="mt-2 text-3xl font-semibold text-slate-900">{product.name}</h1>
                        <p className="mt-3 text-sm text-slate-600 whitespace-pre-line">{desc}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-500">Price per unit</p>
                            <p className="text-2xl font-semibold text-slate-900">{formatCurrency(price)}</p>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {variants.map((variant) => (
                                <button
                                    key={variant.id}
                                    onClick={() => setSelectedVariant(variant)}
                                    className={`rounded-full border px-4 py-2 text-sm ${selectedVariant?.id === variant.id
                                        ? 'border-[color:var(--brand-dark)] bg-[color:var(--brand)] text-white'
                                        : 'border-slate-200 text-slate-600'
                                        }`}
                                >
                                    {variant.size} · {variant.color}
                                </button>
                            ))}
                        </div>
                        <div className="mt-4 flex items-center gap-4">
                            <input
                                type="number"
                                min={10}
                                value={qty}
                                onChange={(event) => setQty(Number(event.target.value))}
                                className="w-24 rounded-full border border-slate-200 px-4 py-2 text-sm"
                            />
                            <button
                                onClick={() =>
                                    addItem({
                                        id: product.id,
                                        name: product.name,
                                        price: price,
                                        quantity: qty,
                                        image: product.primary_image_url,
                                    })
                                }
                                className="rounded-full bg-[color:var(--brand)] px-6 py-3 text-sm font-semibold text-white"
                            >
                                Add to cart
                            </button>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                        <p className="text-sm font-semibold text-slate-800">Bulk pricing tiers</p>
                        <div className="mt-4 space-y-2 text-sm text-slate-600">
                            {tiers.map((tier) => (
                                <div key={tier.id} className="flex items-center justify-between">
                                    <span>{tier.min_qty} - {tier.max_qty} units</span>
                                    <span>{formatCurrency(tier.price_per_unit)}</span>
                                </div>
                            ))}
                            {tiers.length === 0 && <p>Contact sales for custom bulk pricing.</p>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl border border-slate-200 bg-white p-6">
                    <h2 className="text-lg font-semibold text-slate-900">Specifications</h2>
                    <div className="mt-4 grid gap-2 text-sm text-slate-600">
                        {spec ? (
                            <p className="whitespace-pre-line">{spec}</p>
                        ) : (
                            <>
                                <p>MOQ: 10 units</p>
                                <p>GST: 18% (9% CGST + 9% SGST)</p>
                                <p>Backorder: {product.stock > 0 ? 'Available' : 'On request'}</p>
                                <p>Custom printing: {product.custom_printing ? 'Yes' : 'No'}</p>
                            </>
                        )}
                    </div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-6">
                    <h2 className="text-lg font-semibold text-slate-900">Verified reviews</h2>
                    <div className="mt-4 space-y-3 text-sm text-slate-600">
                        {reviews.map((review) => (
                            <div key={review.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                                <p className="font-semibold text-slate-900">{review.customer_name}</p>
                                <p className="text-xs text-slate-500">Rating: {review.rating}/5</p>
                                <p className="mt-2 text-sm">{review.comment}</p>
                            </div>
                        ))}
                        {reviews.length === 0 && <p>No reviews yet.</p>}
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-lg font-semibold text-slate-900">Related products</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                    {related.map((item) => (
                        <Link key={item.id} to={`/product/${item.id}`} className="rounded-2xl border border-slate-200 bg-white p-4">
                            <div className="h-40 overflow-hidden rounded-xl">
                                <img src={item.primary_image_url} alt={item.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="mt-3">
                                <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                                <p className="mt-2 text-sm text-slate-600">{formatCurrency(item.sale_price || item.price)}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
