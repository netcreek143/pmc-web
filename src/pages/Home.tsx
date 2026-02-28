import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { fetcher, formatCurrency } from '../lib/api';
import LoadingState from '../components/LoadingState';

type CMS = { id: number; key: string; title: string; content: string; image_url: string };

type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    sale_price: number;
    primary_image_url: string;
    custom_printing: boolean;
};

export default function Home() {
    const [cms, setCms] = useState<CMS[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchContent = async () => {
        try {
            const [cmsData, productData] = await Promise.all([fetcher('/api/cms-content'), fetcher('/api/products?status=published')]);
            setCms(cmsData);
            setProducts(productData.slice(0, 4));
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    const hero = cms.find((item) => item.key === 'home_hero');
    const banner = cms.find((item) => item.key === 'home_banner');

    if (loading) return <LoadingState label="Loading homepage" />;

    return (
        <div className="space-y-12">
            {hero && (
                <section className="grid gap-8 rounded-3xl bg-white p-8 shadow-sm md:grid-cols-[1.1fr_0.9fr]">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Premium packaging</p>
                        <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">{hero.title}</h1>
                        <p className="mt-4 text-lg text-slate-600">{hero.content}</p>
                        <div className="mt-6 flex flex-wrap gap-4">
                            <Link
                                to="/shop"
                                className="rounded-full bg-[color:var(--brand)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[color:var(--brand-dark)]"
                            >
                                Explore catalog
                            </Link>
                            <Link
                                to="/custom-printing"
                                className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-500"
                            >
                                Custom printing
                            </Link>
                        </div>
                        <div className="mt-8 flex items-center gap-6 text-sm text-slate-500">
                            <div>
                                <p className="text-lg font-semibold text-slate-900">1200+</p>
                                <p>Monthly bulk orders</p>
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-slate-900">99%</p>
                                <p>On-time delivery</p>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-hidden rounded-2xl">
                        <img src={hero.image_url} alt={hero.title} className="h-full w-full object-cover" />
                    </div>
                </section>
            )}

            <section className="grid gap-6 md:grid-cols-3">
                {[
                    { title: 'B2B onboarding', desc: 'GST-ready invoices, credit terms, and tiered pricing.' },
                    { title: 'Custom branding', desc: 'Embossed logo, foiling, and premium finishes at scale.' },
                    { title: 'Fulfillment network', desc: 'Warehouses in key metros to speed up delivery.' },
                ].map((item) => (
                    <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <Sparkles className="text-slate-700" />
                        <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                        <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
                    </div>
                ))}
            </section>

            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Featured</p>
                        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Best-selling packaging</h2>
                    </div>
                    <Link to="/shop" className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        View all <ArrowUpRight size={16} />
                    </Link>
                </div>
                <div className="grid gap-6 md:grid-cols-4">
                    {products.map((product) => (
                        <Link
                            key={product.id}
                            to={`/product/${product.id}`}
                            className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1"
                        >
                            <div className="h-40 overflow-hidden rounded-xl">
                                <img src={product.primary_image_url} alt={product.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="mt-4">
                                <h3 className="text-sm font-semibold text-slate-900">{product.name}</h3>
                                <p className="mt-1 text-xs text-slate-500">{product.custom_printing ? 'Custom printable' : 'Ready stock'}</p>
                                <p className="mt-3 text-sm font-semibold text-slate-900">
                                    {formatCurrency(product.sale_price || product.price)}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {banner && (
                <section className="grid items-center gap-8 rounded-3xl border border-slate-200 bg-white p-8 md:grid-cols-[0.9fr_1.1fr]">
                    <div className="order-2 md:order-1">
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Bulk ready</p>
                        <h2 className="mt-2 text-3xl font-semibold text-slate-900">{banner.title}</h2>
                        <p className="mt-4 text-slate-600">{banner.content}</p>
                        <Link
                            to="/bulk-orders"
                            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[color:var(--brand)] px-6 py-3 text-sm font-semibold text-white"
                        >
                            Start bulk order <ArrowUpRight size={16} />
                        </Link>
                    </div>
                    <div className="order-1 overflow-hidden rounded-2xl md:order-2">
                        <img src={banner.image_url} alt={banner.title} className="h-full w-full object-cover" />
                    </div>
                </section>
            )}
        </div>
    );
}
