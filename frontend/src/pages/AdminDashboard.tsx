import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    BarChart3, Users, BookOpen, TrendingUp, LogOut,
    UserPlus, Activity, CheckCircle, XCircle, Plus
} from 'lucide-react';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const kpiCards = [
        {
            title: 'Totaal Studenten',
            value: '1,247',
            change: '+47 deze maand',
            icon: Users,
            color: 'text-[#0A66FF]',
            bg: 'bg-[#0A66FF]/10'
        },
        {
            title: 'Nieuwe Aanmeldingen Vandaag',
            value: '23',
            badge: 'Nieuw',
            icon: UserPlus,
            color: 'text-[#FF7A00]',
            bg: 'bg-[#FF7A00]/10'
        },
        {
            title: 'Gemiddeld Slagingspercentage',
            value: '84%',
            change: '+3% vs vorige maand',
            icon: TrendingUp,
            color: 'text-[#16A34A]',
            bg: 'bg-[#16A34A]/10'
        },
    ];

    const menuItems = [
        { name: 'Overzicht', icon: BarChart3, active: true },
        { name: 'Studenten Beheer', icon: Users, active: false },
        { name: 'Vragenbank', icon: BookOpen, active: false },
        { name: 'Slagingspercentages', icon: Activity, active: false },
    ];

    const examResults = [
        { name: 'Emma de Vries', date: '13 Dec 2025', score: '46/50', percentage: 92, status: 'Geslaagd' },
        { name: 'Lars Jansen', date: '13 Dec 2025', score: '41/50', percentage: 82, status: 'Gezakt' },
        { name: 'Sophie Bakker', date: '12 Dec 2025', score: '48/50', percentage: 96, status: 'Geslaagd' },
        { name: 'Tim van Dijk', date: '12 Dec 2025', score: '44/50', percentage: 88, status: 'Geslaagd' },
        { name: 'Lisa Mulder', date: '11 Dec 2025', score: '39/50', percentage: 78, status: 'Gezakt' },
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
                        <div>
                            <h1 className="text-xl font-bold">
                                <span className="text-[#0A66FF]">Slag</span>
                                <span className="text-[#FF7A00]">ie</span>
                            </h1>
                            <p className="text-xs text-gray-500">Beheeromgeving</p>
                        </div>
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
                        <p className="text-sm text-gray-400">Beheerder</p>
                        <p className="font-medium text-white truncate">{user?.name || 'Admin'}</p>
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
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1F2937] mb-2">
                            Beheerderspaneel
                        </h1>
                        <p className="text-gray-600">Overzicht van je Slagie platform</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/create-exam')}
                        className="px-6 py-3 bg-[#FF7A00] text-white rounded-xl font-bold hover:bg-[#E56D00] transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                        <Plus size={20} />
                        Nieuw Examen Aanmaken
                    </button>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {kpiCards.map((card, i) => (
                        <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${card.bg}`}>
                                    <card.icon size={24} className={card.color} />
                                </div>
                                {card.badge && (
                                    <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-[#FF7A00] text-white">
                                        {card.badge}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-gray-500 font-medium text-sm mb-1">{card.title}</h3>
                            <p className="text-3xl font-bold text-[#1F2937] mb-2">{card.value}</p>
                            {card.change && (
                                <p className="text-sm text-gray-500">{card.change}</p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Exam Results Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-xl font-bold text-[#1F2937]">
                            Laatste Examenresultaten
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Naam
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Datum
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Score
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Percentage
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {examResults.map((result, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#0A66FF]/10 flex items-center justify-center">
                                                    <span className="font-bold text-[#0A66FF]">
                                                        {result.name.charAt(0)}
                                                    </span>
                                                </div>
                                                <span className="font-medium text-[#1F2937]">
                                                    {result.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {result.date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-bold text-[#1F2937]">
                                                {result.score}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                                                    <div
                                                        className={`h-2 rounded-full ${result.percentage >= 86 ? 'bg-[#16A34A]' : 'bg-red-500'
                                                            }`}
                                                        style={{ width: `${result.percentage}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-medium text-gray-600">
                                                    {result.percentage}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {result.status === 'Geslaagd' ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#16A34A] text-white">
                                                    <CheckCircle size={14} />
                                                    Geslaagd
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-red-500 text-white">
                                                    <XCircle size={14} />
                                                    Gezakt
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
