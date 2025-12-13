import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, CheckCircle, Car } from 'lucide-react';
import { authApi } from '../api/authApi';

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
            // Real API call to backend
            const response = await authApi.login(email, password);

            // Store auth data using AuthContext
            login(response.access_token, response.user as any);

            // Redirect based on role from server
            if (response.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (error: any) {
            console.error("Login failed", error);
            const errorMessage = error.response?.data?.detail || 'Login mislukt. Controleer je gegevens.';
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Column - Navy #0F172A */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] flex-col justify-between p-16 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-20 right-20 w-64 h-64 bg-[#0A66FF] rounded-full opacity-10 blur-3xl"></div>
                <div className="absolute bottom-20 left-20 w-48 h-48 bg-[#FF7A00] rounded-full opacity-10 blur-3xl"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-16">
                        <Car className="w-10 h-10 text-[#0A66FF]" strokeWidth={2.5} />
                        <h1 className="text-3xl font-bold">
                            <span className="text-[#0A66FF]">Slag</span>
                            <span className="text-[#FF7A00]">ie</span>
                        </h1>
                    </div>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h2 className="text-6xl font-bold text-white leading-tight mb-8">
                        Slaag in<br />één keer.
                    </h2>
                    <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                        Oefen met de nieuwste CBR-vragen en haal je rijbewijs zonder stress.
                    </p>

                    <div className="space-y-5">
                        <div className="flex items-center gap-4 text-gray-200">
                            <CheckCircle className="w-6 h-6 text-[#16A34A] flex-shrink-0" />
                            <span>1000+ actuele CBR-examenvragen</span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-200">
                            <CheckCircle className="w-6 h-6 text-[#16A34A] flex-shrink-0" />
                            <span>Gevaarherkenning met video's</span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-200">
                            <CheckCircle className="w-6 h-6 text-[#16A34A] flex-shrink-0" />
                            <span>Real-time voortgangsrapportage</span>
                        </div>
                    </div>
                </div>

                <p className="relative z-10 text-sm text-gray-500">
                    © 2025 Slagie. Alle rechten voorbehouden.
                </p>
            </div>

            {/* Right Column - White */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-12 text-center">
                        <div className="inline-flex items-center gap-3 mb-4">
                            <Car className="w-10 h-10 text-[#0A66FF]" strokeWidth={2.5} />
                            <h1 className="text-3xl font-bold">
                                <span className="text-[#0A66FF]">Slag</span>
                                <span className="text-[#FF7A00]">ie</span>
                            </h1>
                        </div>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-[#1F2937] mb-3">Welkom terug!</h2>
                        <p className="text-gray-600">Log in om verder te gaan met oefenen</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Role Selector */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setRole('student')}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${role === 'student'
                                    ? 'border-[#0A66FF] bg-[#0A66FF]/5 text-[#0A66FF]'
                                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                                    }`}
                            >
                                <Car className={`mb-2 ${role === 'student' ? 'text-[#0A66FF]' : 'text-gray-400'}`} size={24} />
                                <span className="font-semibold text-sm">Student</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('admin')}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${role === 'admin'
                                    ? 'border-[#0A66FF] bg-[#0A66FF]/5 text-[#0A66FF]'
                                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                                    }`}
                            >
                                <Lock className={`mb-2 ${role === 'admin' ? 'text-[#0A66FF]' : 'text-gray-400'}`} size={24} />
                                <span className="font-semibold text-sm">Admin</span>
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                                Email adres
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0A66FF] focus:ring-4 focus:ring-[#0A66FF]/10 transition-all text-[#1F2937] placeholder-gray-400"
                                    placeholder="jouw@email.nl"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#1F2937] mb-2">
                                Wachtwoord
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0A66FF] focus:ring-4 focus:ring-[#0A66FF]/10 transition-all text-[#1F2937] placeholder-gray-400"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-[#0A66FF] border-gray-300 rounded focus:ring-[#0A66FF]"
                                />
                                <span className="text-gray-600">Onthoud mij</span>
                            </label>
                            <a href="#" className="font-medium text-[#FF7A00] hover:text-[#E56D00]">
                                Wachtwoord vergeten?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-[#0A66FF] text-white rounded-xl font-bold text-base shadow-lg shadow-[#0A66FF]/20 hover:bg-[#0055DD] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Laden...</span>
                                </>
                            ) : (
                                <>
                                    <span>Start met Oefenen</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            Nog geen account?{' '}
                            <a href="#" className="font-bold text-[#FF7A00] hover:text-[#E56D00]">
                                Meld je aan
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
