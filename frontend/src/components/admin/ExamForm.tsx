import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, X, Image as ImageIcon, HelpCircle, CheckCircle, MousePointer2, GripHorizontal, Type } from 'lucide-react';

export interface Answer {
    id?: number;
    answer_text: string;
    is_correct: boolean;
    order: number;
    x_position?: number;
    y_position?: number;
}

export interface Question {
    id?: number;
    question_text: string;
    question_image: string;
    question_type: string; // 'multiple_choice' | 'drag_drop' | 'open_question'
    answers: Answer[];
}

export interface ExamData {
    id?: number;
    title: string;
    description: string;
    category: string;
    time_limit: number;
    passing_score: number;
    is_published: boolean;
    questions: Question[];
}

interface ExamFormProps {
    initialData?: ExamData;
    onSubmit: (data: ExamData) => Promise<void>;
    isLoading: boolean;
    pageTitle: string;
    submitLabel: string;
}

const ExamForm: React.FC<ExamFormProps> = ({ initialData, onSubmit, isLoading, pageTitle, submitLabel }) => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [category, setCategory] = useState(initialData?.category || 'Theorie');
    const [timeLimit, setTimeLimit] = useState(initialData?.time_limit || 30);
    const [passingScore, setPassingScore] = useState(initialData?.passing_score || 86);
    const [isPublished, setIsPublished] = useState(initialData?.is_published || false);

    const [questions, setQuestions] = useState<Question[]>(initialData?.questions || [
        {
            question_text: '',
            question_image: '',
            question_type: 'multiple_choice',
            answers: [
                { answer_text: '', is_correct: false, order: 1 },
                { answer_text: '', is_correct: false, order: 2 },
            ]
        }
    ]);

    // Positioning State
    // { qIndex: 0, aIndex: 1 } means we are currently waiting for a click on question 0's image to set pos for answer 1
    const [positioningTarget, setPositioningTarget] = useState<{ qIndex: number, aIndex: number } | null>(null);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description || '');
            setCategory(initialData.category || 'Theorie');
            setTimeLimit(initialData.time_limit || 30);
            setPassingScore(initialData.passing_score || 86);
            setIsPublished(initialData.is_published || false);
            if (initialData.questions && initialData.questions.length > 0) {
                setQuestions(initialData.questions.map(q => ({
                    ...q,
                    question_image: q.question_image || '',
                    answers: q.answers || [],
                    question_type: q.question_type || 'multiple_choice'
                })));
            }
        }
    }, [initialData]);

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                question_text: '',
                question_image: '',
                question_type: 'multiple_choice',
                answers: [
                    { answer_text: '', is_correct: false, order: 1 },
                    { answer_text: '', is_correct: false, order: 2 }
                ]
            }
        ]);
    };

    const removeQuestion = (index: number) => {
        if (questions.length === 1) return;
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    };

    const updateQuestion = (index: number, field: keyof Question, value: any) => {
        const newQuestions = [...questions];

        // If switching to open_question, reset answers to 1 correct answer
        if (field === 'question_type' && value === 'open_question') {
            newQuestions[index] = {
                ...newQuestions[index],
                [field]: value,
                answers: [{ answer_text: '', is_correct: true, order: 1 }]
            };
        }
        // If switching FROM open question to others, ensure at least 2 options
        else if (field === 'question_type' && value !== 'open_question' && newQuestions[index].question_type === 'open_question') {
            newQuestions[index] = {
                ...newQuestions[index],
                [field]: value,
                answers: [
                    { answer_text: '', is_correct: false, order: 1 },
                    { answer_text: '', is_correct: false, order: 2 }
                ]
            };
        }
        else {
            newQuestions[index] = { ...newQuestions[index], [field]: value };
        }
        setQuestions(newQuestions);
    };

    const updateAnswer = (qIndex: number, aIndex: number, field: keyof Answer, value: any) => {
        const newQuestions = [...questions];
        const answers = [...newQuestions[qIndex].answers];
        answers[aIndex] = { ...answers[aIndex], [field]: value };

        // Single Correct Logic for Multiple Choice & Drag Drop
        if ((newQuestions[qIndex].question_type === 'multiple_choice' || newQuestions[qIndex].question_type === 'drag_drop') && field === 'is_correct' && value === true) {
            answers.forEach((a, idx) => { if (idx !== aIndex) a.is_correct = false; });
        }

        newQuestions[qIndex].answers = answers;
        setQuestions(newQuestions);
    };

    const addAnswerOption = (qIndex: number) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].answers.push({
            answer_text: '',
            is_correct: false,
            order: newQuestions[qIndex].answers.length + 1
        });
        setQuestions(newQuestions);
    };

    const removeAnswerOption = (qIndex: number, aIndex: number) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].answers.splice(aIndex, 1);
        setQuestions(newQuestions);
    };

    // Handling Image Clicks for Positioning
    const handleImageClick = (e: React.MouseEvent<HTMLDivElement>, qIndex: number) => {
        if (!positioningTarget || positioningTarget.qIndex !== qIndex) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // Update answer position
        const newQuestions = [...questions];
        const answers = [...newQuestions[qIndex].answers];
        answers[positioningTarget.aIndex] = {
            ...answers[positioningTarget.aIndex],
            x_position: x,
            y_position: y
        };
        newQuestions[qIndex].answers = answers;
        setQuestions(newQuestions);

        // Turn off positioning mode
        setPositioningTarget(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!title.trim()) {
            setError('Titel is verplicht');
            window.scrollTo(0, 0);
            return;
        }

        const payload: ExamData = {
            id: initialData?.id,
            title,
            description,
            time_limit: timeLimit,
            passing_score: passingScore,
            category,
            is_published: isPublished,
            questions: questions.map((q, i) => ({
                ...q,
                question_image: q.question_image || '',
                answers: q.answers.map((a, j) => ({
                    ...a,
                    order: j
                }))
            }))
        };

        try {
            await onSubmit(payload);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.detail || 'Kon examen niet opslaan');
            window.scrollTo(0, 0);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/admin')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-gray-600" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save size={20} />
                        {isLoading ? 'Opslaan...' : submitLabel}
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-8">
                {/* ... Errors ... */}
                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert"><p>{error}</p></div>}

                {/* Exam Settings (Simplified) */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
                    <h2 className="font-bold text-lg mb-4 text-gray-800">Exam Details</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Titel" className="border p-2 rounded col-span-2" />
                        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Beschrijving" className="border p-2 rounded col-span-2" />
                        <div className="flex gap-4 col-span-2">
                            <label className="flex items-center gap-2"><input type="number" value={timeLimit} onChange={e => setTimeLimit(Number(e.target.value))} className="border p-1 w-20 rounded" /> min</label>
                            <label className="flex items-center gap-2"><input type="number" value={passingScore} onChange={e => setPassingScore(Number(e.target.value))} className="border p-1 w-20 rounded" /> % pass</label>
                        </div>
                    </div>
                </div>

                {/* Questions */}
                <div className="space-y-8">
                    {questions.map((q, qIndex) => (
                        <div key={qIndex} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 relative">
                            <button onClick={() => removeQuestion(qIndex)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><Trash2 size={20} /></button>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center">{qIndex + 1}</span>
                                <input
                                    value={q.question_text}
                                    onChange={e => updateQuestion(qIndex, 'question_text', e.target.value)}
                                    placeholder="Vraag tekst..."
                                    className="flex-1 text-lg font-bold border-none focus:ring-0 placeholder-gray-400"
                                />
                            </div>

                            {/* Type Selector & Image URL */}
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Vraag Type</label>
                                    <select
                                        value={q.question_type}
                                        onChange={e => updateQuestion(qIndex, 'question_type', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg p-2"
                                    >
                                        <option value="multiple_choice">Meerkeuze</option>
                                        <option value="drag_drop">Sleep Vraag (Met Afbeelding)</option>
                                        <option value="open_question">Open Vraag (Invul)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Afbeelding URL</label>
                                    <input
                                        value={q.question_image}
                                        onChange={e => updateQuestion(qIndex, 'question_image', e.target.value)}
                                        placeholder="https://..."
                                        className="w-full border border-gray-300 rounded-lg p-2"
                                    />
                                </div>
                            </div>

                            {/* Image Preview & Drag Drop Canvas */}
                            {q.question_image && (
                                <div className="mb-6">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Voorbeeld & Markers:</p>
                                    <div
                                        className={`relative rounded-lg overflow-hidden border-2 bg-gray-100 ${q.question_type === 'drag_drop' ? 'cursor-crosshair border-blue-200' : 'border-dashed border-gray-300'}`}
                                        onClick={(e) => handleImageClick(e, qIndex)}
                                        style={{ minHeight: '200px' }}
                                    >
                                        <img src={q.question_image} alt="Vraag" className="w-full h-auto object-contain max-h-[500px]" />

                                        {/* Render Markers for Drag Drop */}
                                        {q.question_type === 'drag_drop' && q.answers.map((a, aIndex) => (
                                            (a.x_position !== undefined && a.y_position !== undefined) && (
                                                <div
                                                    key={aIndex}
                                                    className="absolute w-8 h-8 -ml-4 -mt-4 bg-yellow-400 text-yellow-900 font-bold rounded-full flex items-center justify-center border-2 border-white shadow-lg pointer-events-none transition-all"
                                                    style={{ left: `${a.x_position}%`, top: `${a.y_position}%` }}
                                                >
                                                    {String.fromCharCode(65 + aIndex)}
                                                </div>
                                            )
                                        ))}

                                        {q.question_type === 'drag_drop' && positioningTarget?.qIndex === qIndex && (
                                            <div className="absolute inset-0 bg-blue-500 bg-opacity-10 pointer-events-none flex items-center justify-center">
                                                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"> Klik op foto voor {String.fromCharCode(65 + positioningTarget.aIndex)} </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Answers Editor */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">Antwoorden</label>
                                {q.answers.map((answer, aIndex) => (
                                    <div key={aIndex} className="flex items-center gap-3">
                                        {q.question_type !== 'open_question' && (
                                            <span className="w-8 font-bold text-gray-400 text-center">{String.fromCharCode(65 + aIndex)}</span>
                                        )}
                                        <input
                                            value={answer.answer_text}
                                            onChange={e => updateAnswer(qIndex, aIndex, 'answer_text', e.target.value)}
                                            placeholder={q.question_type === 'open_question' ? "Het juiste antwoord..." : "Antwoord optie..."}
                                            className="flex-1 border border-gray-300 rounded-lg p-2"
                                        />

                                        {/* Correct Checkbox */}
                                        {(q.question_type === 'multiple_choice' || q.question_type === 'drag_drop') && (
                                            <button onClick={() => updateAnswer(qIndex, aIndex, 'is_correct', !answer.is_correct)} className={`p-2 rounded-full ${answer.is_correct ? 'text-green-600 bg-green-100' : 'text-gray-300 bg-gray-100'}`}>
                                                <CheckCircle size={20} className={answer.is_correct ? 'fill-current' : ''} />
                                            </button>
                                        )}

                                        {/* Positioning Button for Drag Drop */}
                                        {q.question_type === 'drag_drop' && (
                                            <button
                                                type="button"
                                                onClick={() => setPositioningTarget({ qIndex, aIndex })}
                                                className={`p-2 rounded-lg flex items-center gap-1 text-xs font-bold transition-colors ${positioningTarget?.qIndex === qIndex && positioningTarget.aIndex === aIndex ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                            >
                                                <MousePointer2 size={16} />
                                                {answer.x_position ? 'Wijzig Positie' : 'Kies Positie'}
                                            </button>
                                        )}

                                        {q.question_type !== 'open_question' && (
                                            <button onClick={() => removeAnswerOption(qIndex, aIndex)} className="p-2 text-gray-400 hover:text-red-500"><X size={16} /></button>
                                        )}
                                    </div>
                                ))}

                                {q.question_type !== 'open_question' && (
                                    <button onClick={() => addAnswerOption(qIndex)} className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-2">
                                        <Plus size={16} /> Optie toevoegen
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    <button onClick={addQuestion} className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-500 hover:text-blue-500 font-bold flex items-center justify-center gap-2">
                        <Plus size={24} /> Nieuwe Vraag
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExamForm;
