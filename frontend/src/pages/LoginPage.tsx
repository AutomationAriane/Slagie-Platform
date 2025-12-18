import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, CheckCircle, Car } from 'lucide-react';
import { authApi } from '../api/authApi';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, user } = useAuth();
    const navigate = useNavigate();

    // Redirect when user state updates
    React.useEffect(() => {
        if (user) {
            const targetPath = user.role === 'admin' ? '/admin' : '/dashboard/examens';
            // Only navigate if we are NOT already there
            if (!window.location.pathname.startsWith(targetPath)) {
                console.log("LoginPage: Redirecting to", targetPath);
                navigate(targetPath);
            }
        }
    }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Real API call to backend
            const response = await authApi.login(email, password);

            // Store auth data using AuthContext (triggers useEffect)
            login(response.access_token, response.user as any);
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

                <div className="relative z-10 text-gray-400 text-sm">
                    © 2025 Slagie. Alle rechten voorbehouden.
                </div>
            </div>

            {/* Right Column - White Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    <div className="mb-10">
                        <h2 className="text-4xl font-bold text-[#1F2937] mb-3">
                            Welkom terug
                        </h2>
                        <p className="text-gray-600">
                            Log in om verder te gaan met je lessen
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                E-mailadres
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="jouw@email.nl"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#0A66FF] focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Wachtwoord
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#0A66FF] focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#0A66FF] to-[#0052CC] text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                        >
                            {loading ? (
                                <span>Inloggen...</span>
                            ) : (
                                <>
                                    <span>Inloggen</span>
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-600">
                        <p>
                            Test credentials:<br />
                            Admin: admin@test.nl / admin123<br />
                            Student: student@test.nl / student123
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
