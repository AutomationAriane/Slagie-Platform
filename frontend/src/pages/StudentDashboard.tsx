import { useAuth } from '../context/AuthContext';
import {
    Home, AlertOctagon, TrafficCone, FileText, LogOut,
    TrendingUp, ListChecks, Calendar, Rocket, Target, Clock
} from 'lucide-react';

const StudentDashboard = () => {
    const { user, logout } = useAuth();

    const stats = [
        {
            title: 'Slagingskans',
            value: '87%',
            change: '+12%',
            icon: Target,
            color: 'text-[#16A34A]',
            bg: 'bg-[#16A34A]/10'
        },
        {
            title: 'Gemaakte Vragen',
            value: '342',
            change: '+24 vandaag',
            icon: ListChecks,
            color: 'text-[#0A66FF]',
            bg: 'bg-[#0A66FF]/10'
        },
        {
            title: 'Eerstvolgende Examen',
            value: '14 dagen',
            change: '23 Januari',
            icon: Calendar,
            color: 'text-[#FF7A00]',
            bg: 'bg-[#FF7A00]/10'
        },
    ];

    const menuItems = [
        { name: 'Dashboard', icon: Home, active: true, path: '/dashboard' },
        { name: 'Gevaarherkenning', icon: AlertOctagon, active: false, path: '/dashboard/gevaren' },
        { name: 'Verkeersregels', icon: TrafficCone, active: false, path: '/dashboard/regels' },
        { name: 'Proefexamens', icon: FileText, active: false, path: '/dashboard/examens' },
    ];

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Sidebar */}
            <aside className="w-72 bg-[#0F172A] fixed h-full flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#0A66FF] flex items-center justify-center">
                            <span className="text-white font-bold text-lg">S</span>
                        </div>
                        <h1 className="text-xl font-bold">
                            <span className="text-[#0A66FF]">Slag</span>
                            <span className="text-[#FF7A00]">ie</span>
                        </h1>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.name}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${item.active
                                    ? 'bg-white/10 text-[#FF7A00] border-l-4 border-[#FF7A00]'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon size={22} />
                            <span className="font-medium">{item.name}</span>
                        </button>
                    ))}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-white/10">
                    <div className="mb-3 px-4 py-3 bg-white/5 rounded-xl">
                        <p className="text-sm text-gray-400">Ingelogd als</p>
                        <p className="font-medium text-white truncate">{user?.name || 'Student'}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-xl transition-all"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Uitloggen</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-72 p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#1F2937] mb-2">
                        Welkom terug, <span className="text-[#0A66FF]">{user?.name || 'Student'}</span>!
                    </h1>
                    <p className="text-gray-600">Klaar om je voorbereiding te vervolgen?</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <stat.icon size={24} className={stat.color} />
                                </div>
                                <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-green-50 text-[#16A34A]">
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="text-gray-500 font-medium text-sm mb-1">{stat.title}</h3>
                            <p className="text-3xl font-bold text-[#1F2937]">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Hero Action Card */}
                <div className="bg-gradient-to-br from-[#FF7A00] to-[#E56D00] rounded-2xl shadow-xl p-8 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl font-bold text-white mb-3">
                                Klaar voor je volgende oefenexamen?
                            </h2>
                            <p className="text-white/90 mb-6 text-lg">
                                Test je kennis met 50 willekeurige vragen uit het volledige CBR-vragenbestand.
                            </p>
                            <button className="px-8 py-4 bg-white text-[#FF7A00] rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-3">
                                <Rocket size={24} />
                                <span>Start Willekeurig Examen</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-[#1F2937] flex items-center gap-2">
                            <Clock size={24} className="text-[#0A66FF]" />
                            Recente Activiteit
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {[
                            { title: 'Proefexamen Theorie', score: '44/50', status: 'Geslaagd', time: '2 uur geleden' },
                            { title: 'Gevaarherkenning Oefening', score: '8/10', status: 'Geslaagd', time: '1 dag geleden' },
                            { title: 'Verkeersregels Quiz', score: '18/25', status: 'Oefenen', time: '2 dagen geleden' },
                        ].map((activity, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors border-b border-gray-100 last:border-0">
                                <div>
                                    <p className="font-medium text-[#1F2937]">{activity.title}</p>
                                    <p className="text-sm text-gray-500">{activity.time}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-[#1F2937]">{activity.score}</p>
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${activity.status === 'Geslaagd'
                                            ? 'bg-[#16A34A]/10 text-[#16A34A]'
                                            : 'bg-[#FF7A00]/10 text-[#FF7A00]'
                                        }`}>
                                        {activity.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
