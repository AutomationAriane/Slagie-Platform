import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, CheckCircle, XCircle, BookOpen, Clock, Award, Image as ImageIcon, Edit, Layers, Video, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ExamAnswer {
    id: number;
    answer_text: string;
    is_correct: boolean;
    order: number;
}

interface ExamQuestion {
    id: number;
    question_text: string;
    question_image?: string;
    question_type: string;
    answers: ExamAnswer[];
}

interface Exam {
    id: number;
    title: string;
    description?: string;
    cover_image?: string;
    time_limit?: number;
    passing_score?: number;
    category?: string;
    is_published: boolean;
    questions?: ExamQuestion[];
}

interface Course {
    id: number;
    title: string;
    description?: string;
    cover_image?: string;
    is_published: boolean;
    created_at: string;
}

const ExamenManager: React.FC = () => {
    const { token, logout, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();

    // State
    const [activeTab, setActiveTab] = useState<'exams' | 'courses'>('exams');
    const [exams, setExams] = useState<Exam[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);

    // Exam Detail View State
    const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch on load / tab change
    useEffect(() => {
        if (authLoading) return;
        if (!token) {
            setLoading(false);
            return;
        }

        if (activeTab === 'exams') {
            fetchExams();
        } else {
            fetchCourses();
        }
    }, [authLoading, token, activeTab]);

    const handleAuthError = () => {
        alert('Sessie verlopen. Log opnieuw in.');
        logout();
        navigate('/login');
    };

    const fetchExams = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8000/api/admin/exams', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExams(response.data);
            setError(null);
        } catch (err: any) {
            if (err.response?.status === 401 || err.response?.status === 403) handleAuthError();
            else setError(err.response?.data?.detail || 'Kon examens niet laden');
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8000/api/courses', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCourses(response.data);
            setError(null);
        } catch (err: any) {
            if (err.response?.status === 401 || err.response?.status === 403) handleAuthError();
            else setError(err.response?.data?.detail || 'Kon cursussen niet laden');
        } finally {
            setLoading(false);
        }
    };

    const fetchExamDetail = async (examId: number) => {
        if (!token) return;
        try {
            const response = await axios.get(`http://localhost:8000/api/admin/exams/${examId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSelectedExam(response.data);
        } catch (err: any) {
            if (err.response?.status === 401 || err.response?.status === 403) handleAuthError();
            else setError(err.response?.data?.detail || 'Kon examen details niet laden');
        }
    };

    const togglePublish = async (examId: number, currentStatus: boolean) => {
        if (!token) return;
        try {
            const endpoint = currentStatus ? 'unpublish' : 'publish';
            await axios.put(
                `http://localhost:8000/api/admin/exams/${examId}/${endpoint}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchExams();
            if (selectedExam?.id === examId) fetchExamDetail(examId);
        } catch (err: any) {
            if (err.response?.status === 401 || err.response?.status === 403) handleAuthError();
            else alert(err.response?.data?.detail || 'Kon status niet wijzigen');
        }
    };

    // Render Loading / Error
    if (loading && !exams.length && !courses.length) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Laden...</div>;
    }

    if (error && !exams.length && !courses.length) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    // --- DETAIL VIEW (EXAMS ONLY) ---
    if (selectedExam) {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-8 py-6">
                    <button onClick={() => setSelectedExam(null)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
                        <ArrowLeft size={20} /> Terug naar overzicht
                    </button>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{selectedExam.title}</h1>
                            <p className="text-gray-600 mt-1">{selectedExam.description}</p>
                            <div className="flex gap-4 mt-3 text-sm text-gray-500">
                                <span className="flex items-center gap-1"><Clock size={16} />{selectedExam.time_limit} min</span>
                                <span className="flex items-center gap-1"><Award size={16} />{selectedExam.passing_score}% slagingspercentage</span>
                                <span className="flex items-center gap-1"><BookOpen size={16} />{selectedExam.questions?.length || 0} vragen</span>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate(`/admin/exams/${selectedExam.id}/edit`)}
                            className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all font-semibold flex items-center gap-2"
                        >
                            <Edit size={20} /> Bewerken
                        </button>
                    </div>
                </div>
                {/* Questions List */}
                <div className="p-8 max-w-5xl mx-auto">
                    <div className="space-y-6">
                        {selectedExam.questions?.map((q, index) => (
                            <div key={q.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center">{index + 1}</span>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{q.question_text}</h3>
                                        {q.question_image && (
                                            <img src={q.question_image} alt="" className="h-32 w-auto object-cover rounded-lg mb-4 border border-gray-100" />
                                        )}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {q.answers.map((a, i) => (
                                                <div key={a.id} className={`flex items-center gap-3 p-3 rounded-lg border ${a.is_correct ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`}>
                                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${a.is_correct ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'}`}>{String.fromCharCode(65 + i)}</span>
                                                    <span className="flex-1">{a.answer_text}</span>
                                                    {a.is_correct && <CheckCircle className="text-green-600" size={20} />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // --- MAIN LIST LIST VIEW (Exams/Courses) ---
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-6">
                <h1 className="text-3xl font-bold text-gray-900">Platform Beheer</h1>
                <p className="text-gray-600 mt-1">Beheer examens en cursussen</p>

                {/* Tabs */}
                <div className="flex items-center gap-6 mt-6 border-b border-gray-100">
                    <button
                        onClick={() => setActiveTab('exams')}
                        className={`pb-3 px-2 font-medium transition-colors border-b-2 ${activeTab === 'exams' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        <div className="flex items-center gap-2">
                            <BookOpen size={20} />
                            Examens
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('courses')}
                        className={`pb-3 px-2 font-medium transition-colors border-b-2 ${activeTab === 'courses' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        <div className="flex items-center gap-2">
                            <Layers size={21} />
                            Cursussen
                        </div>
                    </button>
                </div>
            </div>

            <div className="p-8">
                {/* Action Bar */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                        {activeTab === 'exams' ? 'Alle Examens' : 'Alle Cursussen'}
                    </h2>
                    <button
                        onClick={() => navigate(activeTab === 'exams' ? '/admin/create-exam' : '/admin/create-course')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold shadow-sm"
                    >
                        <Plus size={20} />
                        {activeTab === 'exams' ? 'Nieuw Examen' : 'Nieuwe Cursus'}
                    </button>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* EXAMS LIST */}
                    {activeTab === 'exams' && exams.map((exam) => (
                        <div key={exam.id} className="bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-all cursor-pointer overflow-hidden group">
                            {exam.cover_image ? (
                                <img src={exam.cover_image} alt={exam.title} className="w-full h-48 object-cover" />
                            ) : (
                                <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                    <BookOpen className="text-white" size={64} />
                                </div>
                            )}
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{exam.title}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${exam.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {exam.is_published ? 'Live' : 'Concept'}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{exam.description || 'Geen beschrijving'}</p>
                                <div className="flex gap-3 text-xs text-gray-500 mb-4">
                                    <span className="flex items-center gap-1"><Clock size={14} />{exam.time_limit}min</span>
                                    <span className="flex items-center gap-1"><Award size={14} />{exam.passing_score}%</span>
                                    <span className="flex items-center gap-1"><BookOpen size={14} />{exam.category}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => fetchExamDetail(exam.id)} className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium flex items-center justify-center gap-1">
                                        <Eye size={16} /> Bekijken
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); navigate(`/admin/exams/${exam.id}/edit`); }} className="px-3 py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 font-medium flex items-center justify-center gap-1">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); togglePublish(exam.id, exam.is_published); }} className={`px-3 py-2 rounded-lg font-medium ${exam.is_published ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                                        {exam.is_published ? 'Unpublish' : 'Publish'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* COURSES LIST */}
                    {activeTab === 'courses' && courses.map((course) => (
                        <div key={course.id} className="bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-all cursor-pointer overflow-hidden group">
                            {course.cover_image ? (
                                <img src={course.cover_image} alt={course.title} className="w-full h-48 object-cover" />
                            ) : (
                                <div className="w-full h-48 bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
                                    <Layers className="text-white" size={64} />
                                </div>
                            )}
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${course.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {course.is_published ? 'Live' : 'Concept'}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description || 'Geen beschrijving'}</p>

                                <div className="flex gap-2">
                                    <button onClick={(e) => { e.stopPropagation(); navigate(`/admin/courses/${course.id}/edit`); }} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2">
                                        <Edit size={16} /> Bewerken
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty States */}
                {activeTab === 'exams' && exams.length === 0 && !loading && (
                    <div className="text-center py-12 col-span-full">
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Nog geen examens aangemaakt.</p>
                    </div>
                )}
                {activeTab === 'courses' && courses.length === 0 && !loading && (
                    <div className="text-center py-12 col-span-full">
                        <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Nog geen cursussen aangemaakt.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamenManager;
