import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, User, Shield, CheckCircle } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'student' | 'admin'>('student');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Login with selected role
            await login(email, password, role);

            // Redirect based on selected role
            if (email.includes('admin') || role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/student/dashboard');
            }
        } catch (error) {
            console.error("Login failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Column (50%) - Corporate Identity */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 flex-col justify-between p-12 relative overflow-hidden">
                {/* Background Decor (Optional Gradient) */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 z-0"></div>

                {/* Content */}
                <div className="relative z-10 text-white">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            AZ
                        </div>
                        <span className="text-2xl font-bold tracking-wide">Ariane Services</span>
                    </div>
                </div>

                <div className="relative z-10 text-white max-w-lg mb-20">
                    <h1 className="text-5xl font-bold leading-tight mb-6">
                        Kwaliteit <br /><span className="text-amber-500">in Zorg.</span>
                    </h1>
                    <p className="text-slate-300 text-lg mb-8">
                        Welkom bij het AZ Scholing platform. Beheer competenties, volg cursussen en blijf altijd bekwaam.
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-300">
                            <CheckCircle size={20} className="text-amber-500" />
                            <span>Direct toegang tot e-learnings</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                            <CheckCircle size={20} className="text-amber-500" />
                            <span>Real-time competentie overzichten</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                            <CheckCircle size={20} className="text-amber-500" />
                            <span>Gevalideerde certificering</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-slate-500 text-sm">
                    &copy; {new Date().getFullYear()} Ariane Services. Alle rechten voorbehouden.
                </div>
            </div>

            {/* Right Column (50%) - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white">
                <div className="w-full max-w-md">
                    {/* Mobile Header (Only visible on small screens) */}
                    <div className="lg:hidden mb-10 text-center">
                        <div className="inline-flex items-center justify-center p-3 bg-amber-50 rounded-xl mb-4">
                            <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                AZ
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Ariane Services</h2>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Welkom terug</h2>
                        <p className="text-slate-500">Log in met je accountgegevens om verder te gaan.</p>
                    </div>

                    {/* Role Selector */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <button
                            onClick={() => setRole('student')}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${role === 'student'
                                    ? 'border-amber-500 bg-amber-50 text-amber-700'
                                    : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            <User size={24} className={`mb-2 ${role === 'student' ? 'text-amber-600' : 'text-slate-400'}`} />
                            <span className="font-semibold text-sm">Student</span>
                        </button>
                        <button
                            onClick={() => setRole('admin')}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${role === 'admin'
                                    ? 'border-amber-500 bg-amber-50 text-amber-700'
                                    : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            <Shield size={24} className={`mb-2 ${role === 'admin' ? 'text-amber-600' : 'text-slate-400'}`} />
                            <span className="font-semibold text-sm">Admin</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Email adres</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-slate-900 placeholder-slate-400"
                                    placeholder="naam@ariane-services.nl"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Wachtwoord</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-slate-900 placeholder-slate-400"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500" />
                                <span className="text-slate-600">Onthoud mij</span>
                            </label>
                            <a href="#" className="font-medium text-amber-600 hover:text-amber-700">Wachtwoord vergeten?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-amber-500 text-white rounded-xl font-bold text-base shadow-lg shadow-amber-500/20 hover:bg-amber-600 hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Laden...</span>
                                </>
                            ) : (
                                <>
                                    <span>Inloggen</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
