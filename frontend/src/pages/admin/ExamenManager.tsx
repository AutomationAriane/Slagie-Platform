import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, CheckCircle, XCircle, BookOpen, Clock, Award, Image as ImageIcon } from 'lucide-react';
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

const ExamenManager: React.FC = () => {
    const { token, logout, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [exams, setExams] = useState<Exam[]>([]);
    const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch all exams
    useEffect(() => {
        // Wait for auth to finish loading
        if (authLoading) return;

        // If no token after auth loading, don't show error - let ProtectedRoute handle it
        if (!token) {
            setLoading(false);
            return;
        }

        fetchExams();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authLoading, token]);

    const handleAuthError = () => {
        alert('Sessie verlopen. Log opnieuw in.');
        logout();
        navigate('/login');
    };

    const fetchExams = async () => {
        if (!token) return;

        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8000/api/admin/exams', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExams(response.data);
            setError(null);
        } catch (err: any) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                handleAuthError();
            } else {
                setError(err.response?.data?.detail || 'Kon examens niet laden');
            }
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
            if (err.response?.status === 401 || err.response?.status === 403) {
                handleAuthError();
            } else {
                setError(err.response?.data?.detail || 'Kon examen details niet laden');
            }
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

            // Refresh exams list
            fetchExams();
            if (selectedExam?.id === examId) {
                fetchExamDetail(examId);
            }
        } catch (err: any) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                handleAuthError();
            } else {
                alert(err.response?.data?.detail || 'Kon publicatiestatus niet wijzigen');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Examens laden...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    // Detail View
    if (selectedExam) {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-8 py-6">
                    <button
                        onClick={() => setSelectedExam(null)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft size={20} />
                        Terug naar overzicht
                    </button>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{selectedExam.title}</h1>
                            <p className="text-gray-600 mt-1">{selectedExam.description}</p>
                            <div className="flex gap-4 mt-3 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Clock size={16} />
                                    {selectedExam.time_limit} minuten
                                </span>
                                <span className="flex items-center gap-1">
                                    <Award size={16} />
                                    {selectedExam.passing_score}% slagingspercentage
                                </span>
                                <span className="flex items-center gap-1">
                                    <BookOpen size={16} />
                                    {selectedExam.questions?.length || 0} vragen
                                </span>
                            </div>
                        </div>
                        <div>
                            <button
                                onClick={() => togglePublish(selectedExam.id, selectedExam.is_published)}
                                className={`px-6 py-3 rounded-xl font-bold transition-all ${selectedExam.is_published
                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {selectedExam.is_published ? '✓ Gepubliceerd' : 'Publiceren'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Questions List */}
                <div className="p-8 max-w-6xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Vragen ({selectedExam.questions?.length || 0})
                    </h2>

                    <div className="space-y-6">
                        {selectedExam.questions?.map((question, index) => (
                            <div key={question.id} className="bg-white rounded-xl border-2 border-gray-200 p-6">
                                {/* Question Header */}
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center flex-shrink-0">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-lg text-gray-900 font-medium">{question.question_text}</p>
                                    </div>
                                </div>

                                {/* Question Image */}
                                {question.question_image && (
                                    <div className="mb-4 ml-16">
                                        <div className="relative inline-block">
                                            <img
                                                src={question.question_image}
                                                alt={`Vraag ${index + 1}`}
                                                className="max-w-md rounded-lg border-2 border-gray-200 shadow-sm"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                            <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs text-gray-600 flex items-center gap-1">
                                                <ImageIcon size={12} />
                                                Afbeelding
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Answer Options */}
                                <div className="ml-16 space-y-2">
                                    {question.answers
                                        .sort((a, b) => a.order - b.order)
                                        .map((answer, ansIndex) => (
                                            <div
                                                key={answer.id}
                                                className={`p-4 rounded-lg border-2 transition-all ${answer.is_correct
                                                    ? 'bg-green-50 border-green-500 text-green-900'
                                                    : 'bg-gray-50 border-gray-200 text-gray-700'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${answer.is_correct
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-gray-200 text-gray-600'
                                                        }`}>
                                                        {String.fromCharCode(65 + ansIndex)}
                                                    </span>
                                                    <span className="flex-1">{answer.answer_text}</span>
                                                    {answer.is_correct && (
                                                        <CheckCircle className="text-green-600" size={20} />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // List View
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-6">
                <h1 className="text-3xl font-bold text-gray-900">Examen Beheer</h1>
                <p className="text-gray-600 mt-1">Beheer en publiceer examens voor studenten</p>
            </div>

            {/* Exams Grid */}
            <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {exams.map((exam) => (
                        <div
                            key={exam.id}
                            className="bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-all cursor-pointer overflow-hidden"
                        >
                            {/* Cover Image */}
                            {exam.cover_image ? (
                                <img
                                    src={exam.cover_image}
                                    alt={exam.title}
                                    className="w-full h-48 object-cover"
                                />
                            ) : (
                                <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                    <BookOpen className="text-white" size={64} />
                                </div>
                            )}

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-xl font-bold text-gray-900">{exam.title}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${exam.is_published
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {exam.is_published ? 'Live' : 'Concept'}
                                    </span>
                                </div>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {exam.description || 'Geen beschrijving'}
                                </p>

                                <div className="flex gap-3 text-xs text-gray-500 mb-4">
                                    <span className="flex items-center gap-1">
                                        <Clock size={14} />
                                        {exam.time_limit}min
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Award size={14} />
                                        {exam.passing_score}%
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <BookOpen size={14} />
                                        {exam.category}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => fetchExamDetail(exam.id)}
                                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2 font-semibold"
                                    >
                                        <Eye size={16} />
                                        Bekijken
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            togglePublish(exam.id, exam.is_published);
                                        }}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${exam.is_published
                                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            : 'bg-green-500 text-white hover:bg-green-600'
                                            }`}
                                    >
                                        {exam.is_published ? 'Verbergen' : 'Publiceren'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {exams.length === 0 && (
                    <div className="text-center py-12">
                        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Geen examens gevonden</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamenManager;
