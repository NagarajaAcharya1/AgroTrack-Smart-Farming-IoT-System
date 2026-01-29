import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, BarChart2, ShieldCheck, ArrowRight, Sun, Moon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/Footer';

const LandingPage = () => {
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen overflow-hidden relative transition-colors duration-300 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
            <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto z-20 relative">
                <div className="flex items-center gap-2">
                    <Sprout className="text-agro-500" size={32} />
                    <span className="text-2xl font-bold tracking-tight">AgroTrack</span>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex gap-4 items-center">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full text-slate-400 hover:bg-slate-800 transition-colors"
                    >
                        {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
                    </button>
                    <Link to="/login" className="px-4 py-2 text-slate-400 hover:text-agro-500 transition-colors font-medium">Login</Link>
                    <Link to="/dashboard" className="px-6 py-2 bg-agro-500 rounded-full font-bold text-white hover:bg-agro-600 transition-colors shadow-lg shadow-agro-500/20">
                        Live Demo
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full text-slate-400 hover:bg-slate-800 transition-colors"
                    >
                        {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
                    </button>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600 dark:text-slate-300">
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-20 left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 z-30 shadow-xl md:hidden"
                    >
                        <div className="flex flex-col gap-4">
                            <Link to="/login" className="text-center py-3 text-slate-600 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                                Login
                            </Link>
                            <Link to="/dashboard" className="text-center py-3 bg-agro-500 text-white font-bold rounded-lg shadow-lg shadow-agro-500/20">
                                Live Demo
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <div className="relative pt-20 pb-32 lg:pt-32 px-6">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8 z-10"
                    >
                        <div className="inline-block px-4 py-1 rounded-full bg-agro-500/10 border border-agro-500/20 text-agro-400 text-sm font-medium">
                            🚀 Next Gen Smart Farming
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                            Monitor Your Fields <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-agro-400 to-teal-400">
                                In Real-Time
                            </span>
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
                            Deploy intelligent robots to track soil moisture, temperature, and crop health. Make data-driven decisions to maximize yield.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link to="/dashboard" className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-full font-bold text-lg hover:opacity-90 transition-all shadow-xl">
                                View Dashboard <ArrowRight size={20} />
                            </Link>
                            <button className="px-8 py-4 bg-white text-slate-900 border-slate-200 dark:bg-slate-800 dark:text-white rounded-full font-bold text-lg border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                                Learn More
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        {/* Abstract Farm/Robot Illustration Placeholder (using CSS shapes) */}
                        <div className="relative w-full aspect-square max-w-lg mx-auto">
                            <div className="absolute inset-0 bg-gradient-to-br from-agro-500/30 to-blue-500/30 rounded-3xl blur-3xl animate-pulse"></div>
                            <div className="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl h-full flex flex-col items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-20">
                                    {[...Array(36)].map((_, i) => (
                                        <div key={i} className="border border-slate-700"></div>
                                    ))}
                                </div>
                                <Sprout size={120} className="text-agro-500 mb-4 md:mb-6 drop-shadow-2xl relative z-10" />
                                <div className="text-xl md:text-2xl font-bold relative z-10 mb-1">Field Rover 01</div>
                                <div className="text-agro-400 relative z-10 text-sm md:text-base">Status: Online & Scanning</div>

                                {/* Fake data points popping up */}
                                <div className="absolute top-4 right-4 md:top-10 md:right-10 bg-slate-800 p-2 rounded-lg border border-slate-600 text-xs shadow-lg animate-bounce">
                                    Wait... 23°C
                                </div>
                                <div className="absolute bottom-4 left-4 md:bottom-20 md:left-10 bg-slate-800 p-2 rounded-lg border border-slate-600 text-xs shadow-lg animate-bounce" style={{ animationDelay: '1s' }}>
                                    Moisture: 65%
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="bg-slate-100 dark:bg-slate-900 py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
                        <p className="text-slate-600 dark:text-slate-400">Everything you need to manage your smart farm.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: BarChart2, title: "Live Analytics", desc: "Real-time charts and graphs for every sensor metric." },
                            { icon: ShieldCheck, title: "Crop Health", desc: "NDVI analysis to detect stress before it becomes a problem." },
                            { icon: Sprout, title: "Smart Alerts", desc: "Instant notifications when moisture drops below threshold." }
                        ].map((f, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-agro-500 transition-colors">
                                <f.icon className="text-agro-500 mb-4" size={40} />
                                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default LandingPage;
