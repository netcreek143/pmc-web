import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, UserCircle, Heart, Search } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '../lib/store';
import type { CartState, CartItem } from '../lib/store';

const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/shop' },
    { label: 'Bulk Orders', to: '/bulk-orders' },
    { label: 'Custom Printing', to: '/custom-printing' },
    { label: 'Blog', to: '/blog' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
    const items = useCartStore((state: CartState) => state.items);
    const cartCount = items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
    const navigate = useNavigate();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    return (
        <div className="min-h-screen bg-[#fbf8f6] text-slate-900">
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <Link to="/" className="text-xl font-semibold tracking-tight text-[color:var(--brand-dark)]">
                        PackMyCake
                    </Link>
                    <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) =>
                                    `transition ${isActive ? 'text-slate-900' : 'hover:text-slate-900'}`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>
                    <div className="flex items-center gap-3 text-slate-600">
                        <div className="relative flex items-center">
                            {isSearchOpen && (
                                <form onSubmit={handleSearch} className="absolute right-0 top-0 flex items-center pr-10 animate-in slide-in-from-right-4 fade-in duration-200">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search products..."
                                        className="h-[38px] w-56 sm:w-64 rounded-full border border-slate-200 bg-white px-4 text-sm focus:border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-300 shadow-sm"
                                        autoFocus
                                    />
                                </form>
                            )}
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="relative z-10 rounded-full border border-slate-200 bg-white p-2 transition hover:text-slate-900 shadow-sm"
                            >
                                <Search size={18} />
                            </button>
                        </div>
                        <Link to="/wishlist" className="rounded-full border border-slate-200 p-2 transition hover:text-slate-900">
                            <Heart size={18} />
                        </Link>
                        <Link to="/account" className="rounded-full border border-slate-200 p-2 transition hover:text-slate-900">
                            <UserCircle size={18} />
                        </Link>
                        <Link
                            to="/cart"
                            className="relative rounded-full border border-slate-200 p-2 transition hover:text-slate-900"
                        >
                            <ShoppingBag size={18} />
                            {cartCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[color:var(--brand)] text-[10px] text-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </header>
            <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
            <footer className="border-t border-slate-200 bg-white">
                <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 md:grid-cols-3">
                    <div>
                        <p className="text-lg font-semibold">PackMyCake</p>
                        <p className="mt-2 text-sm text-slate-600">
                            Premium packaging for modern bakeries. Pan-India fulfillment with GST ready invoices.
                        </p>
                    </div>
                    <div className="text-sm text-slate-600">
                        <p className="font-semibold text-slate-800">Quick Links</p>
                        <ul className="mt-2 space-y-1">
                            {navLinks.map((link) => (
                                <li key={link.to}>
                                    <Link to={link.to} className="hover:text-slate-900">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="text-sm text-slate-600">
                        <p className="font-semibold text-slate-800">Contact</p>
                        <p className="mt-2">hello@packmycake.in</p>
                        <p>+91 88888 11111</p>
                        <p className="mt-4 text-xs text-slate-400">© 2026 PackMyCake. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
