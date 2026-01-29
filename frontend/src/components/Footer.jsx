import React from 'react';
import { Sprout, Twitter, Linkedin, Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Sprout className="text-agro-500" size={32} />
                            <span className="text-2xl font-bold tracking-tight text-white">AgroTrack</span>
                        </div>
                        <p className="text-slate-400 leading-relaxed">
                            Empowering farmers with intelligent robotics and real-time data analytics for a sustainable future.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-agro-500 hover:text-white transition-all">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-agro-500 hover:text-white transition-all">
                                <Linkedin size={20} />
                            </a>
                            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-agro-500 hover:text-white transition-all">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-agro-500 hover:text-white transition-all">
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Product</h3>
                        <ul className="space-y-4">
                            <li><a href="#" className="hover:text-agro-400 transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-agro-400 transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-agro-400 transition-colors">Case Studies</a></li>
                            <li><a href="#" className="hover:text-agro-400 transition-colors">Documentation</a></li>
                            <li><a href="#" className="hover:text-agro-400 transition-colors">API Reference</a></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Company</h3>
                        <ul className="space-y-4">
                            <li><a href="#" className="hover:text-agro-400 transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-agro-400 transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-agro-400 transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-agro-400 transition-colors">Press Kit</a></li>
                            <li><Link to="/admin" className="hover:text-agro-400 transition-colors">Admin Login</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Contact</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin size={20} className="text-agro-500 shrink-0 mt-1" />
                                <span>Adyar, Mangalore, Karnataka, India</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={20} className="text-agro-500 shrink-0" />
                                <span>+91 9876543210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={20} className="text-agro-500 shrink-0" />
                                <span>contact@agrotrack.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                    <p>© {currentYear} AgroTrack Inc. All rights reserved.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
