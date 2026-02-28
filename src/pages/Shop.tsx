import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetcher, formatCurrency } from '../lib/api';
import LoadingState from '../components/LoadingState';

type Category = { id: number; name: string };

type Product = {
    id: number;
    name: string;
    price: number;
    sale_price: number;
    stock: number;
    primary_image_url: string;
    category_id: number;
};

export default function Shop() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [activeCategory, setActiveCategory] = useState<number | 'all'>('all');
    const [sort, setSort] = useState('latest');
    const [searchParams] = useSearchParams();
    const querySearch = searchParams.get('search') || '';
    const [search, setSearch] = useState(querySearch);
    const [priceRange, setPriceRange] = useState([0, 250]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [categoryData, productData] = await Promise.all([fetcher('/api/categories'), fetcher('/api/products?status=published')]);
            setCategories(categoryData);
            setProducts(productData);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        setSearch(querySearch);
    }, [querySearch]);

    const filteredProducts = useMemo(() => {
        let data = [...products];
        if (activeCategory !== 'all') {
            data = data.filter((item) => item.category_id === activeCategory);
        }
        if (search) {
            data = data.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
        }
        data = data.filter((item) => (item.sale_price || item.price) <= priceRange[1]);
        if (sort === 'price_low') {
            data.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price));
        }
        if (sort === 'price_high') {
            data.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price));
        }
        return data;
    }, [products, activeCategory, sort, search, priceRange]);

    if (loading) return <LoadingState label="Loading products" />;

    return (
        <div className="space-y-8">
            <header className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-8 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Shop</p>
                    <h1 className="mt-2 text-3xl font-semibold text-slate-900">Catalog for every bake size</h1>
                    <p className="mt-2 text-sm text-slate-600">Filters, MOQ pricing, and ready stock for quick dispatch.</p>
                </div>
                <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value)}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600"
                >
                    <option value="latest">Latest</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                </select>
            </header>

            <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
                <aside className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6">
                    <div>
                        <p className="text-sm font-semibold text-slate-800">Search</p>
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search products"
                            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
                        />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-800">Price (max)</p>
                        <input
                            type="range"
                            min={0}
                            max={250}
                            value={priceRange[1]}
                            onChange={(event) => setPriceRange([0, Number(event.target.value)])}
                            className="mt-2 w-full"
                        />
                        <p className="mt-2 text-xs text-slate-500">Up to ₹{priceRange[1]}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-800">Categories</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            <button
                                onClick={() => setActiveCategory('all')}
                                className={`rounded-full px-3 py-1 text-xs ${activeCategory === 'all'
                                    ? 'bg-[color:var(--brand)] text-white'
                                    : 'border border-slate-200 text-slate-600'
                                    }`}
                            >
                                All
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`rounded-full px-3 py-1 text-xs ${activeCategory === category.id
                                        ? 'bg-[color:var(--brand)] text-white'
                                        : 'border border-slate-200 text-slate-600'
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {filteredProducts.map((product) => (
                        <Link key={product.id} to={`/product/${product.id}`} className="rounded-2xl border border-slate-200 bg-white p-4">
                            <div className="h-52 overflow-hidden rounded-xl">
                                <img src={product.primary_image_url} alt={product.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="mt-4">
                                <h3 className="text-base font-semibold text-slate-900">{product.name}</h3>
                                <p className="mt-1 text-xs text-slate-500">Stock: {product.stock}</p>
                                <p className="mt-3 text-sm font-semibold text-slate-900">
                                    {formatCurrency(product.sale_price || product.price)}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
