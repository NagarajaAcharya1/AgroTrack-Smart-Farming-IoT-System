import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, History, Settings, LogOut, Sprout, Sun, Moon } from 'lucide-react';
import { useTheme } from './context/ThemeContext';

const Layout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

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
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-20 lg:w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 z-50 flex flex-col transition-all duration-300 shadow-xl lg:shadow-none">
                <div className="h-20 flex items-center justify-center border-b border-slate-200 dark:border-slate-800">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-agro-100 dark:bg-agro-500/10 p-2 rounded-xl">
                            <Sprout size={28} className="text-agro-600 dark:text-agro-500" />
                        </div>
                        <span className="hidden lg:block font-bold text-xl tracking-tight text-slate-800 dark:text-white">AgroTrack</span>
                    </Link>
                </div>

                <nav className="flex-1 py-8 px-4 space-y-3">
                    <Link to="/dashboard" className={`flex items-center p-3.5 rounded-xl transition-all duration-200 font-medium ${isActive('/dashboard')}`}>
                        <LayoutDashboard size={22} />
                        <span className="hidden lg:block ml-3">Live Monitor</span>
                    </Link>
                    <Link to="/history" className={`flex items-center p-3.5 rounded-xl transition-all duration-200 font-medium ${isActive('/history')}`}>
                        <History size={22} />
                        <span className="hidden lg:block ml-3">History</span>
                    </Link>
                    <Link to="/admin" className={`flex items-center p-3.5 rounded-xl transition-all duration-200 font-medium ${isActive('/admin')}`}>
                        <Settings size={22} />
                        <span className="hidden lg:block ml-3">Admin</span>
                    </Link>
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center p-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        {theme === 'dark' ? <Sun size={22} className="text-amber-400" /> : <Moon size={22} className="text-slate-600" />}
                        <span className="hidden lg:block ml-3 font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center p-3 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                        <LogOut size={22} />
                        <span className="hidden lg:block ml-3 font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-20 lg:ml-64 p-6 lg:p-10 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default Layout;
