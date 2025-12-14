import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Save, Send, Plus, Trash2, Upload, Clock,
    Award, Tag, Image as ImageIcon, CheckCircle
} from 'lucide-react';
import axios from 'axios';

interface ExamAnswer {
    answer_text: string;
    is_correct: boolean;
    order: number;
}

interface ExamQuestion {
    question_text: string;
    question_image: string;
    question_type: string;
    order: number;
    answers: ExamAnswer[];
}

interface ExamData {
    title: string;
    description: string;
    cover_image: string;
    time_limit: number;
    passing_score: number;
    category: string;
    is_published: boolean;
    questions: ExamQuestion[];
}

const CreateExam: React.FC = () => {
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Exam settings
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [timeLimit, setTimeLimit] = useState(30);
    const [passingScore, setPassingScore] = useState(86);
    const [category, setCategory] = useState('Theorie');

    // Questions
    const [questions, setQuestions] = useState<ExamQuestion[]>([]);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(null);

    const addQuestion = () => {
        const newQuestion: ExamQuestion = {
            question_text: '',
            question_image: '',
            question_type: 'multiple_choice',
            order: questions.length,
            answers: [
                { answer_text: '', is_correct: false, order: 0 },
                { answer_text: '', is_correct: false, order: 1 },
                { answer_text: '', is_correct: false, order: 2 },
                { answer_text: '', is_correct: false, order: 3 }
            ]
        };
        setQuestions([...questions, newQuestion]);
        setActiveQuestionIndex(questions.length);
    };

    const deleteQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
        setActiveQuestionIndex(null);
    };

    const updateQuestion = (index: number, field: string, value: any) => {
        const updated = [...questions];
        (updated[index] as any)[field] = value;
        setQuestions(updated);
    };

    const updateAnswer = (qIndex: number, aIndex: number, field: string, value: any) => {
        const updated = [...questions];
        (updated[qIndex].answers[aIndex] as any)[field] = value;
        setQuestions(updated);
    };

    const setCorrectAnswer = (qIndex: number, aIndex: number) => {
        const updated = [...questions];
        updated[qIndex].answers.forEach((a, i) => {
            a.is_correct = i === aIndex;
        });
        setQuestions(updated);
    };

    const saveAsDraft = async () => {
        await saveExam(false);
    };

    const publishNow = async () => {
        await saveExam(true);
    };

    const saveExam = async (publish: boolean) => {
        try {
            const token = localStorage.getItem('auth_token');

            const examData: ExamData = {
                title,
                description,
                cover_image: coverImage,
                time_limit: timeLimit,
                passing_score: passingScore,
                category,
                is_published: publish,
                questions
            };

            const response = await axios.post(
                'http://localhost:8000/api/admin/exams',
                examData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (publish) {
                setToastMessage('✅ Examen staat live voor studenten!');
            } else {
                setToastMessage('✅ Examen opgeslagen als concept');
            }

            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                navigate('/admin');
            }, 2000);

        } catch (error: any) {
            console.error('Error saving exam:', error);
            alert(error.response?.data?.detail || 'Fout bij opslaan examen');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-4 right-4 bg-[#16A34A] text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-bounce">
                    {toastMessage}
                </div>
            )}

            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1F2937]">Nieuw Examen Aanmaken</h1>
                        <p className="text-gray-500 text-sm mt-1">Bouw je examen met vragen, antwoorden en instellingen</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin')}
                        className="text-gray-600 hover:text-gray-900 font-medium"
                    >
                        ← Terug
                    </button>
                </div>
            </div>

            {/* Split Screen Layout */}
            <div className="flex">
                {/* LEFT COLUMN - Questions (Scrollable) */}
                <div className="flex-1 p-8 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-[#1F2937] mb-4">Vragen ({questions.length})</h2>

                        {questions.length === 0 && (
                            <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
                                <p className="text-gray-500 mb-4">Nog geen vragen toegevoegd</p>
                                <button
                                    onClick={addQuestion}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A66FF] text-white rounded-xl hover:bg-[#0055DD] transition-all"
                                >
                                    <Plus size={20} /> Eerste Vraag Toevoegen
                                </button>
                            </div>
                        )}

                        {/* Question List */}
                        {questions.map((q, qIndex) => (
                            <div
                                key={qIndex}
                                className={`mb-4 bg-white rounded-xl border-2 p-6 transition-all ${activeQuestionIndex === qIndex
                                        ? 'border-[#0A66FF] shadow-lg'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                onClick={() => setActiveQuestionIndex(qIndex)}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="font-bold text-[#1F2937]">Vraag {qIndex + 1}</h3>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteQuestion(qIndex);
                                        }}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                {/* Question Text */}
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Vraagtekst
                                    </label>
                                    <textarea
                                        value={q.question_text}
                                        onChange={(e) => updateQuestion(qIndex, 'question_text', e.target.value)}
                                        placeholder="Bijv: Wat betekent dit verkeersbord?"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A66FF] focus:outline-none resize-none"
                                        rows={3}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>

                                {/* Question Image */}
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Afbeelding URL (optioneel)
                                    </label>
                                    <input
                                        type="text"
                                        value={q.question_image}
                                        onChange={(e) => updateQuestion(qIndex, 'question_image', e.target.value)}
                                        placeholder="/static/images/verkeersbord.jpg"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A66FF] focus:outline-none"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>

                                {/* Answers */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Antwoorden
                                    </label>
                                    {q.answers.map((answer, aIndex) => (
                                        <div key={aIndex} className="flex items-center gap-3 mb-3">
                                            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600">
                                                {String.fromCharCode(65 + aIndex)}
                                            </span>
                                            <input
                                                type="text"
                                                value={answer.answer_text}
                                                onChange={(e) => updateAnswer(qIndex, aIndex, 'answer_text', e.target.value)}
                                                placeholder={`Antwoord ${String.fromCharCode(65 + aIndex)}`}
                                                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-[#0A66FF] focus:outline-none"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setCorrectAnswer(qIndex, aIndex);
                                                }}
                                                className={`px-4 py-2 rounded-xl font-semibold transition-all ${answer.is_correct
                                                        ? 'bg-[#16A34A] text-white'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {answer.is_correct ? '✓ Juist' : 'Markeer'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Add Question Button */}
                        {questions.length > 0 && (
                            <button
                                onClick={addQuestion}
                                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-[#0A66FF] hover:text-[#0A66FF] transition-all flex items-center justify-center gap-2 font-semibold"
                            >
                                <Plus size={20} /> Nieuwe Vraag Toevoegen
                            </button>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN - Settings (Sticky) */}
                <div className="w-96 bg-white border-l border-gray-200 p-6 sticky top-0" style={{ height: '100vh', overflowY: 'auto' }}>
                    {/* Cover Image */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-[#1F2937] mb-3 flex items-center gap-2">
                            <ImageIcon size={20} /> Cover Afbeelding
                        </h3>
                        <div className="mb-3">
                            {coverImage ? (
                                <div className="relative">
                                    <img
                                        src={coverImage}
                                        alt="Cover"
                                        className="w-full h-40 object-cover rounded-xl border-2 border-gray-200"
                                    />
                                    <button
                                        onClick={() => setCoverImage('')}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="w-full h-40 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                                    <Upload size={32} className="text-gray-400" />
                                </div>
                            )}
                        </div>
                        <input
                            type="text"
                            value={coverImage}
                            onChange={(e) => setCoverImage(e.target.value)}
                            placeholder="Afbeelding URL invoeren"
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-[#0A66FF] focus:outline-none"
                        />
                    </div>

                    {/* Basic Info */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-[#1F2937] mb-3">Basis Informatie</h3>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Titel</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Bijv: CBR Theorie 2025"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A66FF] focus:outline-none"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Beschrijving</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Korte beschrijving van het examen"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A66FF] focus:outline-none resize-none"
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-[#1F2937] mb-3">Instellingen</h3>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Clock size={16} /> Tijdslimiet (minuten)
                            </label>
                            <input
                                type="number"
                                value={timeLimit}
                                onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A66FF] focus:outline-none"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Award size={16} /> Slagingspercentage (%)
                            </label>
                            <input
                                type="number"
                                value={passingScore}
                                onChange={(e) => setPassingScore(parseInt(e.target.value))}
                                min="0"
                                max="100"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A66FF] focus:outline-none"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Tag size={16} /> Categorie
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0A66FF] focus:outline-none"
                            >
                                <option value="Theorie">Theorie</option>
                                <option value="Gevaarherkenning">Gevaarherkenning</option>
                                <option value="Verkeersregels">Verkeersregels</option>
                                <option value="Mix">Mix</option>
                            </select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-bold text-[#1F2937] mb-3">Acties</h3>

                        <button
                            onClick={saveAsDraft}
                            disabled={!title || questions.length === 0}
                            className="w-full mb-3 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={20} /> Opslaan als Concept
                        </button>

                        <button
                            onClick={publishNow}
                            disabled={!title || questions.length === 0}
                            className="w-full py-4 bg-[#FF7A00] text-white rounded-xl font-bold hover:bg-[#E56D00] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={20} /> Nu Publiceren
                        </button>

                        <p className="text-xs text-gray-500 mt-3 text-center">
                            {questions.length === 0 && 'Voeg minimaal 1 vraag toe'}
                            {!title && questions.length > 0 && 'Voer een titel in'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateExam;
