import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, Building2, Users, ListTree, PackagePlus,
    Truck, ShoppingCart, TicketPercent,
    Megaphone, Star, Sliders, LogOut, Menu,
    UserCircle, FileText, BarChart, Package, Receipt
} from 'lucide-react';
import { useAuthStore } from '../lib/store';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const links = [
    { label: 'Dashboard', to: '/admin', end: true, icon: <LayoutDashboard size={18} /> },
    { label: 'Company details', to: '/admin/company', icon: <Building2 size={18} /> },
    { label: 'Employee Details', to: '/admin/employee', icon: <Users size={18} /> },
    { label: 'Category', to: '/admin/category', icon: <ListTree size={18} /> },
    { label: 'Add Products', to: '/admin/products/add', icon: <PackagePlus size={18} /> },
    { label: 'Products List', to: '/admin/products', end: true, icon: <Package size={18} /> },
    { label: 'Customers', to: '/admin/customers', icon: <UserCircle size={18} /> },
    { label: 'Transmit', to: '/admin/transmit', icon: <Truck size={18} /> },
    { label: 'Orders', to: '/admin/orders', icon: <ShoppingCart size={18} /> },
    { label: 'Invoice Settings', to: '/admin/invoice', icon: <Receipt size={18} /> },
    { label: 'Coupons', to: '/admin/coupons', icon: <TicketPercent size={18} /> },
    { label: 'Campaign', to: '/admin/campaign', icon: <Megaphone size={18} /> },
    { label: 'Reviews', to: '/admin/reviews', icon: <Star size={18} /> },
    { label: 'Customize', to: '/admin/customize', icon: <Sliders size={18} /> },
    { label: 'Content CMS', to: '/admin/content', icon: <FileText size={18} /> },
    { label: 'Reports', to: '/admin/reports', icon: <BarChart size={18} /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const setToken = useAuthStore((state) => state.setToken);
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        setToken(null);
        navigate('/login');
    };

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 bg-slate-50 transition-transform lg:static lg:block ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="flex h-16 items-center justify-between px-6 bg-[#16192b]">
                    <span className="text-sm font-semibold tracking-wider text-white">PACK MY CAKE</span>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
                        <Menu size={20} />
                    </button>
                </div>
                <div className="h-[calc(100vh-4rem)] overflow-y-auto py-4 bg-[#f8f9fa]">
                    <nav className="space-y-1 px-3">
                        {links.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.end}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-md px-3 py-2 text-[15px] font-medium transition-colors ${isActive
                                        ? 'bg-[#2a2f4c] text-white border-l-[6px] border-[#fca5a5]'
                                        : 'text-slate-800 hover:bg-slate-200 border-l-[6px] border-transparent'
                                    }`
                                }
                            >
                                {link.icon}
                                {link.label}
                            </NavLink>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-md border-l-[6px] border-transparent px-3 py-2 text-[15px] font-medium hover:bg-slate-200 text-slate-800 text-left mt-2"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Header using existing styling colors */}
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-500 hover:text-slate-700">
                            <Menu size={24} />
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin Avatar" className="h-full w-full object-cover" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">Hi, <span className="font-semibold text-slate-900">Pack My Cake</span></span>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="mx-auto max-w-6xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
