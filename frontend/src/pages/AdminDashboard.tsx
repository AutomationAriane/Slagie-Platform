import React from 'react';
import {
    BarChart3, Users, BookOpen, Settings, LogOut,
    Search, Bell, TrendingUp, Award, Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user, logout } = useAuth();

    // Stats data met nieuwe iconen en kleuren
    const stats = [
        {
            title: 'Behaalde Competenties',
            value: '1,248',
            trend: '+12%',
            icon: Award,
            // Amber logic: bg-amber-100 text-amber-600
            bg: 'bg-amber-100',
            color: 'text-amber-600'
        },
        {
            title: 'Openstaande Cursussen',
            value: '45',
            trend: '+3',
            icon: BookOpen,
            bg: 'bg-amber-100',
            color: 'text-amber-600'
        },
        {
            title: 'Actieve Studenten',
            value: '892',
            trend: '+8%',
            icon: Users,
            bg: 'bg-amber-100',
            color: 'text-amber-600'
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Sidebar (Left) - slate-900 */}
            <aside className="w-72 bg-slate-900 text-white fixed h-full z-20 flex flex-col transition-all duration-300">
                {/* Logo Area */}
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        AZ
                    </div>
                    <span className="font-bold text-xl tracking-wide">Ariane Admin</span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 mt-4">
                    {[
                        { name: 'Home', icon: BarChart3, active: true },
                        { name: 'Mijn Voortgang', icon: TrendingUp, active: false },
                        { name: 'Cursussen', icon: BookOpen, active: false },
                        { name: 'Competenties', icon: Award, active: false },
                        { name: 'Instellingen', icon: Settings, active: false },
                    ].map((item) => (
                        <button
                            key={item.name}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-r-none rounded-l-xl transition-all duration-200 group ${item.active
                                    ? 'bg-slate-800 text-amber-500 border-r-4 border-amber-500' // Active state
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800' // Inactive state
                                }`}
                        >
                            <item.icon size={22} className={item.active ? 'text-amber-500' : 'text-slate-400 group-hover:text-white'} />
                            <span className="font-medium text-sm">{item.name}</span>
                        </button>
                    ))}
                </nav>

                {/* Logout Area */}
                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-all font-medium"
                    >
                        <LogOut size={20} />
                        Uitloggen
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-72">
                {/* Topbar (Header) - bg-white shadow-sm */}
                <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center sticky top-0 z-10">
                    {/* Breadcrumbs / Title */}
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Dashboard</h2>
                        <nav className="flex text-sm text-slate-500 mt-1">
                            <span>Admin</span>
                            <span className="mx-2">/</span>
                            <span className="text-amber-600 font-medium">Home</span>
                        </nav>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-6">
                        {/* Search Bar */}
                        <div className="hidden md:flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-2.5 w-64 border border-transparent focus-within:border-amber-500 focus-within:bg-white transition-all">
                            <Search className="text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Zoeken..."
                                className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder-slate-400"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="relative p-2 text-slate-500 hover:bg-gray-100 rounded-full transition-colors">
                                <Bell size={22} />
                                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>

                            {/* Profile Dropdown Trigger */}
                            <div className="flex items-center gap-3 pl-6 border-l border-gray-200 cursor-pointer">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-slate-900 leading-tight">{user?.name || 'Admin User'}</p>
                                    <p className="text-xs text-slate-500 capitalize">{user?.role || 'Administrator'}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center border-2 border-white shadow-sm text-slate-600 font-bold">
                                    {user?.name?.charAt(0) || 'A'}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Inner Content */}
                <div className="p-8 max-w-7xl mx-auto">

                    {/* Welcome Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 relative overflow-hidden">
                        <div className="relative z-10">
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                Welkom terug, <span className="text-amber-600">{user?.name || 'Beheerder'}</span>!
                            </h1>
                            <p className="text-slate-500 max-w-2xl">
                                Je hebt 3 nieuwe meldingen en 2 openstaande taken voor vandaag.
                                Bekijk hieronder je voortgang en recente activiteiten.
                            </p>
                        </div>
                        {/* Subtiele decoratie rechts - optioneel */}
                        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-amber-50 to-transparent opacity-50 z-0"></div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {stats.map((stat, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3.5 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                        <stat.icon size={24} />
                                    </div>
                                    {stat.trend && (
                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${stat.trend.startsWith('+')
                                                ? 'bg-green-50 text-green-700'
                                                : 'bg-red-50 text-red-700'
                                            }`}>
                                            {stat.trend}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-slate-500 font-medium text-sm mb-1">{stat.title}</h3>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Example Placeholder Content Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Activity Placeholder */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[300px]">
                            <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                                <Clock size={20} className="text-amber-500" />
                                Recente Activiteit
                            </h3>
                            <div className="space-y-4">
                                {[1, 2, 3].map((_, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors border-b border-gray-50 last:border-0">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0"></div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">Nieuwe inschrijving cursus Wondzorg</p>
                                            <p className="text-xs text-slate-500">2 uur geleden</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions / Status */}
                        <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 p-6 text-white">
                            <h3 className="font-bold text-lg mb-4 text-amber-500">Systeem Status</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-slate-800 rounded-xl">
                                    <span>Server Status</span>
                                    <span className="flex items-center gap-2 text-green-400 text-sm font-bold">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                        Online
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-slate-800 rounded-xl">
                                    <span>Database</span>
                                    <span className="flex items-center gap-2 text-green-400 text-sm font-bold">
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        Verbonden
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
