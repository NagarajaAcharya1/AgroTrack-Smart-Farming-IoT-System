import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, History, Settings, LogOut, Sprout, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from './context/ThemeContext';

const Layout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [isSidebarOpen, setSidebarOpen] = React.useState(false);

    const isActive = (path) => location.pathname === path
        ? 'bg-agro-500 text-white shadow-lg shadow-agro-500/30'
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-agro-600 dark:hover:text-white';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 z-40 px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <Sprout className="text-agro-500" size={24} />
                    <span className="font-bold text-lg tracking-tight text-slate-800 dark:text-white">AgroTrack</span>
                </Link>
                <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-600 dark:text-slate-300">
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 z-50 flex flex-col transition-transform duration-300 shadow-2xl lg:shadow-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="h-20 hidden lg:flex items-center justify-center border-b border-slate-200 dark:border-slate-800">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-agro-100 dark:bg-agro-500/10 p-2 rounded-xl">
                            <Sprout size={28} className="text-agro-600 dark:text-agro-500" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-white">AgroTrack</span>
                    </Link>
                </div>

                {/* Mobile Sidebar Header */}
                <div className="h-16 lg:hidden flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-lg">Menu</span>
                    <button onClick={() => setSidebarOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-2">
                    <Link to="/dashboard" onClick={() => setSidebarOpen(false)} className={`flex items-center p-3.5 rounded-xl transition-all duration-200 font-medium ${isActive('/dashboard')}`}>
                        <LayoutDashboard size={22} />
                        <span className="ml-3">Live Monitor</span>
                    </Link>
                    <Link to="/history" onClick={() => setSidebarOpen(false)} className={`flex items-center p-3.5 rounded-xl transition-all duration-200 font-medium ${isActive('/history')}`}>
                        <History size={22} />
                        <span className="ml-3">History</span>
                    </Link>
                    <Link to="/admin" onClick={() => setSidebarOpen(false)} className={`flex items-center p-3.5 rounded-xl transition-all duration-200 font-medium ${isActive('/admin')}`}>
                        <Settings size={22} />
                        <span className="ml-3">Admin</span>
                    </Link>
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                    <button
                        onClick={() => { toggleTheme(); setSidebarOpen(false); }}
                        className="w-full flex items-center p-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        {theme === 'dark' ? <Sun size={22} className="text-amber-400" /> : <Moon size={22} className="text-slate-600" />}
                        <span className="ml-3 font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center p-3 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                        <LogOut size={22} />
                        <span className="ml-3 font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 p-4 lg:p-10 pt-20 lg:pt-10 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default Layout;
