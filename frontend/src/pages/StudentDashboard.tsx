import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Home, AlertOctagon, TrafficCone, FileText, LogOut,
    TrendingUp, ListChecks, Calendar, Rocket, Target, Clock, ArrowRight, Bot
} from 'lucide-react';
import { getExams, getStudentProgress, startCbrExam, getExamHistory, deleteExam, Exam, TopicProgress, ExamHistoryItem } from '../api';
import { Trash2 } from 'lucide-react';

const StudentDashboard = () => {
    // ... (state vars unchanged)

    const handleStartCbr = async () => {
        try {
            const newExam = await startCbrExam();
            navigate(`/dashboard/examens/${newExam.id}`);
        } catch (error) {
            console.error("Failed to start CBR exam", error);
            alert("Kon geen examen genereren. Probeer het later opnieuw.");
        }
    };

    const handleDeleteExam = async (examId: number, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click
        if (!confirm("Weet je zeker dat je deze simulatie wilt verwijderen?")) return;

        try {
            await deleteExam(examId);
            setExams(exams.filter(ex => ex.id !== examId));
        } catch (error) {
            console.error("Failed to delete exam", error);
            alert("Kon examen niet verwijderen.");
        }
    };

    // ... (useEffect unchanged)

    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const examsRef = useRef<HTMLDivElement>(null);
    const [exams, setExams] = useState<Exam[]>([]);
    const [progress, setProgress] = useState<TopicProgress[]>([]);
    const [history, setHistory] = useState<ExamHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Auto-scroll to exams if path is /dashboard/examens
    useEffect(() => {
        if (location.pathname === '/dashboard/examens' && examsRef.current) {
            examsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [location, loading]);

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [examsData, progressData, historyData] = await Promise.all([
                    getExams(),
                    getStudentProgress(),
                    getExamHistory()
                ]);
                setExams(examsData);
                setProgress(progressData);
                setHistory(historyData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Derived Stats
    const totalAnswered = progress.reduce((sum, p) => sum + p.total_answered, 0);
    const totalCorrect = progress.reduce((sum, p) => sum + p.total_correct, 0);
    const overallPercentage = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

    const stats = [
        {
            title: 'Slagingskans',
            value: `${overallPercentage}%`,
            change: 'Gebaseerd op oefeningen',
            icon: Target,
            color: 'text-[#16A34A]',
            bg: 'bg-[#16A34A]/10'
        },
        {
            title: 'Gemaakte Vragen',
            value: totalAnswered.toString(),
            change: 'Totaal',
            icon: ListChecks,
            color: 'text-[#0A66FF]',
            bg: 'bg-[#0A66FF]/10'
        },
        {
            title: 'Eerstvolgende Examen',
            value: 'Binnenkort',
            change: 'Plan nu in',
            icon: Calendar,
            color: 'text-[#FF7A00]',
            bg: 'bg-[#FF7A00]/10'
        },
    ];

    const menuItems = [
        { name: 'Dashboard', icon: Home, active: location.pathname === '/dashboard' || location.pathname === '/dashboard/examens', path: '/dashboard/examens' },
        { name: 'AI Instructeur', icon: Bot, active: location.pathname === '/dashboard/chat', path: '/dashboard/chat' },
        { name: 'Gevaarherkenning', icon: AlertOctagon, active: location.pathname === '/dashboard/gevaren', path: '/dashboard/gevaren' },
        { name: 'Verkeersregels', icon: TrafficCone, active: location.pathname === '/dashboard/regels', path: '/dashboard/regels' },
        { name: 'Proefexamens', icon: FileText, active: location.pathname === '/dashboard/examens', path: '/dashboard/examens' },
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
                            onClick={() => navigate(item.path)}
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
                        <p className="font-medium text-white truncate">{user?.email || 'Student'}</p>
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
                        Welkom terug, <span className="text-[#0A66FF]">{user?.email?.split('@')[0] || 'Student'}</span>!
                    </h1>
                    <p className="text-gray-600">Jouw persoonlijke voortgang naar je rijbewijs.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <stat.icon size={24} className={stat.color} />
                                </div>
                            </div>
                            <h3 className="text-gray-500 font-medium text-sm mb-1">{stat.title}</h3>
                            <p className="text-3xl font-bold text-[#1F2937]">{stat.value}</p>
                            <span className="text-xs text-gray-400 mt-2 block">{stat.change}</span>
                        </div>
                    ))}
                </div>

                {/* TOPIC MASTERY (New Feature) */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-[#1F2937] flex items-center gap-2 mb-4">
                        <TrendingUp size={24} className="text-[#0A66FF]" />
                        Jouw Beheersing per Onderwerp
                    </h2>

                    {progress.length === 0 && !loading ? (
                        <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm">
                            Oefen eerst nog wat vragen om je statistieken te zien!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {progress.map((p, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-gray-700">{p.topic || 'Algemeen'}</span>
                                        <span className={`font-bold ${p.percentage >= 80 ? 'text-green-600' : p.percentage >= 50 ? 'text-orange-500' : 'text-red-500'}`}>
                                            {p.percentage}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                                        <div
                                            className={`h-2.5 rounded-full transition-all duration-1000 ${p.percentage >= 80 ? 'bg-green-500' : p.percentage >= 50 ? 'bg-orange-400' : 'bg-red-500'
                                                }`}
                                            style={{ width: `${p.percentage}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2 text-right">{p.total_correct}/{p.total_answered} goed</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Hero Action Card */}
                <div className="bg-gradient-to-br from-[#FF7A00] to-[#E56D00] rounded-2xl shadow-xl p-8 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl font-bold text-white mb-3">
                                Klaar voor een echte CBR Simulatie?
                            </h2>
                            <p className="text-white/90 mb-6 text-lg">
                                Start een volledig examen volgens de officiële regels: 25 Gevaarherkenning, 12 Kennis, 28 Inzicht.
                            </p>
                            <button
                                onClick={handleStartCbr}
                                className="px-8 py-4 bg-white text-[#FF7A00] rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-3"
                            >
                                <Rocket size={24} />
                                <span>Start CBR Examen</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Hero Action Card 2 (Practice - Updated) */}
                <div className="bg-gradient-to-br from-[#0A66FF] to-[#0055DD] rounded-2xl shadow-xl p-8 mb-8 relative overflow-hidden">
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

                {/* Beschikbare Proefexamens */}
                <div className="mb-8" ref={examsRef}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-[#1F2937] flex items-center gap-2">
                            <FileText size={28} className="text-[#0A66FF]" />
                            Beschikbare Proefexamens
                        </h2>
                        {exams.length > 0 && (
                            <span className="px-3 py-1 bg-[#0A66FF]/10 text-[#0A66FF] rounded-full text-sm font-bold">
                                {exams.filter(e => !e.title.startsWith("CBR Simulatie")).length} beschikbaar
                            </span>
                        )}
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#0A66FF] border-t-transparent"></div>
                            <p className="text-gray-500 mt-4">Examens laden...</p>
                        </div>
                    ) : (
                        <>
                            {/* Standard Exams */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {exams.filter(e => !e.title.startsWith("CBR Simulatie")).map((exam) => (
                                    <div
                                        key={exam.id}
                                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group"
                                    >
                                        {/* Cover Image */}
                                        <div className="relative h-40 bg-gradient-to-br from-[#0A66FF] to-[#0055DD] overflow-hidden">
                                            {exam.cover_image ? (
                                                <img
                                                    src={exam.cover_image}
                                                    alt={exam.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <FileText size={48} className="text-white/30" />
                                                </div>
                                            )}
                                            <div className="absolute top-3 right-3">
                                                <span className="px-3 py-1 bg-[#FF7A00] text-white text-xs font-bold rounded-full">
                                                    {exam.category}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-[#1F2937] mb-2 group-hover:text-[#0A66FF] transition-colors">
                                                {exam.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                {exam.description || 'Geen beschrijving beschikbaar'}
                                            </p>

                                            {/* Exam Info */}
                                            <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Clock size={16} />
                                                    <span>{exam.time_limit} min</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Target size={16} />
                                                    <span>{exam.passing_score}% slagen</span>
                                                </div>
                                            </div>

                                            {/* Start Button */}
                                            <button
                                                onClick={() => navigate(`/dashboard/examens/${exam.id}`)}
                                                className="w-full py-3 bg-[#0A66FF] text-white rounded-xl font-bold hover:bg-[#0055DD] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg group-hover:scale-105">
                                                <span>Start Examen</span>
                                                <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* My Simulations Section */}
                            {exams.some(e => e.title.startsWith("CBR Simulatie")) && (
                                <>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-[#1F2937] flex items-center gap-2">
                                            <Rocket size={28} className="text-[#FF7A00]" />
                                            Mijn Simulaties
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {exams.filter(e => e.title.startsWith("CBR Simulatie")).map((exam) => (
                                            <div
                                                key={exam.id}
                                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group relative"
                                            >
                                                <div className="p-6">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="p-3 bg-orange-100 rounded-xl text-orange-600">
                                                            <Rocket size={24} />
                                                        </div>
                                                        <button
                                                            onClick={(e) => handleDeleteExam(exam.id, e)}
                                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Verwijder simulatie"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </div>

                                                    <h3 className="text-xl font-bold text-[#1F2937] mb-2">
                                                        {exam.title}
                                                    </h3>
                                                    <p className="text-gray-500 text-sm mb-4">
                                                        {exam.description}
                                                    </p>

                                                    <button
                                                        onClick={() => navigate(`/dashboard/examens/${exam.id}`)}
                                                        className="w-full py-3 bg-white border-2 border-[#FF7A00] text-[#FF7A00] rounded-xl font-bold hover:bg-[#FF7A00] hover:text-white transition-all flex items-center justify-center gap-2">
                                                        <span>Start Simulatie</span>
                                                        <ArrowRight size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    )}
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
                        {history.length === 0 ? (
                            <p className="text-gray-500 text-sm">Nog geen recente activiteit.</p>
                        ) : history.map((activity, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors border-b border-gray-100 last:border-0">
                                <div>
                                    <p className="font-medium text-[#1F2937]">{activity.exam_title}</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(activity.completed_at).toLocaleDateString()} {new Date(activity.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-[#1F2937]">{activity.score}/{activity.max_score}</p>
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${activity.is_passed
                                        ? 'bg-[#16A34A]/10 text-[#16A34A]'
                                        : 'bg-[#FF7A00]/10 text-[#FF7A00]'
                                        }`}>
                                        {activity.is_passed ? 'Geslaagd' : 'Gezakt'}
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
