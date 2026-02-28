import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetcher, formatCurrency } from '../lib/api';
import LoadingState from '../components/LoadingState';

export default function Category() {
    const { id } = useParams();
    const [category, setCategory] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [categories, productData] = await Promise.all([fetcher('/api/categories'), fetcher('/api/products?status=published')]);
            const selected = categories.find((item: any) => item.id === Number(id));
            setCategory(selected);
            setProducts(productData.filter((item: any) => item.category_id === Number(id)));
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    if (loading) return <LoadingState label="Loading category" />;
    if (!category) return null;

    return (
        <div className="space-y-8">
            <header className="rounded-3xl border border-slate-200 bg-white p-8">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Category</p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">{category.name}</h1>
                <p className="mt-2 text-sm text-slate-600">{category.description}</p>
            </header>
            <div className="grid gap-6 md:grid-cols-3">
                {products.map((product) => (
                    <Link key={product.id} to={`/product/${product.id}`} className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="h-52 overflow-hidden rounded-xl">
                            <img src={product.primary_image_url} alt={product.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="mt-4">
                            <h3 className="text-base font-semibold text-slate-900">{product.name}</h3>
                            <p className="mt-3 text-sm font-semibold text-slate-900">
                                {formatCurrency(product.sale_price || product.price)}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
