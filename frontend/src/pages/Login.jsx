import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            const endpoint = isLogin ? 'http://localhost:5000/api/login' : 'http://localhost:5000/api/register';
            const res = await axios.post(endpoint, formData);

            if (isLogin) {
                if (res.data.token) {
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                    navigate('/dashboard');
                }
            } else {
                setSuccessMsg('Registration successful! Please login.');
                setIsLogin(true);
                setFormData({ username: '', email: '', password: '' });
            }
        } catch (err) {
            setError(err.response?.data?.message || (isLogin ? 'Login failed.' : 'Registration failed.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 transition-colors duration-300 px-4 relative">
            <div className="w-full max-w-md mb-8">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-agro-600 dark:hover:text-agro-400 transition-colors font-medium"
                >
                    <ArrowLeft size={20} />
                    Back to Home
                </Link>
            </div>

            <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <div className="bg-agro-500 p-8 text-center">
                    <div className="inline-flex p-3 bg-white/20 rounded-full mb-4">
                        <Sprout size={40} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{isLogin ? 'Welcome Back' : 'Join AgroTrack'}</h2>
                    <p className="text-agro-100 mt-2">{isLogin ? 'Sign in to monitor your fields' : 'Create an account to get started'}</p>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}
                    {successMsg && (
                        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                            <Sprout size={18} />
                            {successMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Username</label>
                                <div className="relative">
                                    <Sprout className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-agro-500 focus:border-transparent outline-none transition-all dark:text-white"
                                        placeholder="Farmer John"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-agro-500 focus:border-transparent outline-none transition-all dark:text-white"
                                    placeholder="admin@agro.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-agro-500 focus:border-transparent outline-none transition-all dark:text-white"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-agro-500 hover:bg-agro-600 text-white font-bold rounded-lg shadow-lg shadow-agro-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-500">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            type="button"
                            onClick={() => { setIsLogin(!isLogin); setError(''); setSuccessMsg(''); }}
                            className="text-agro-600 font-bold hover:underline bg-transparent border-0 cursor-pointer"
                        >
                            {isLogin ? 'Create Account' : 'Login here'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
