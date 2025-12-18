import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { startExam, checkAnswer, finishExam, Question } from '../../api';
import { ArrowRight, CheckCircle, XCircle, AlertCircle, Home, MousePointer2 } from 'lucide-react';

const QuizPage = () => {
    const { examId } = useParams();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [examTitle, setExamTitle] = useState("");

    // Quiz State
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [textAnswer, setTextAnswer] = useState("");
    const [feedback, setFeedback] = useState<{ is_correct: boolean; correct_text: string; explanation?: string } | null>(null);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        const initQuiz = async () => {
            if (!examId) return;
            try {
                // Modified API to return object with questions
                // But startExam returns Question[] directly in my api.ts implementation?
                // Let's check api.ts: return response.data.questions; -> Yes returns Question[]
                // Wait, I updated api.ts to return response.data.questions.
                // But endpoint returns StudentExamStartResponse { title, questions ... }
                // So I need to fetch title too?
                // My api.ts update: 
                // export const startExam = async (examId: string) => {
                //      const response = await api.get<{ questions: Question[] }>(...);
                //      return response.data.questions;
                // };
                // This loses the title! 
                // I should have updated api.ts to return the whole object or just questions.
                // Assuming questions for now.
                const questionsData = await startExam(examId);
                setQuestions(questionsData);
            } catch (error) {
                console.error("Error starting quiz", error);
            } finally {
                setLoading(false);
            }
        };
        initQuiz();
    }, [examId]);

    const submitAnswer = async () => {
        const currentQ = questions[currentIndex];

        // Validation
        if (currentQ.question_type === 'open_question' && !textAnswer.trim()) return;
        if (currentQ.question_type !== 'open_question' && selectedOption === null) return;

        if (feedback) return; // Already answered

        try {
            const result = await checkAnswer(
                currentQ.id,
                selectedOption || undefined,
                currentQ.question_type === 'open_question' ? textAnswer : undefined
            );

            setFeedback({
                is_correct: result.is_correct,
                correct_text: result.correct_answer_text,
                explanation: result.explanation
            });

            if (result.is_correct) setScore(s => s + 1);
        } catch (error) {
            console.error("Check failed", error);
        }
    };

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setTextAnswer("");
            setFeedback(null);
        } else {
            finish();
        }
    };

    const finish = async () => {
        setIsFinished(true);
        if (examId) {
            await finishExam(examId, score, questions.length);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center text-blue-600 font-bold">Examen laden...</div>;
    if (questions.length === 0) return <div className="h-screen flex items-center justify-center text-red-500">Geen vragen gevonden.</div>;

    // RESULT SCREEN
    if (isFinished) {
        const passed = (score / questions.length) >= 0.86; // 43/50
        return (
            <div className={`min-h-screen flex items-center justify-center p-4 ${passed ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="bg-white rounded-3xl shadow-xl p-10 max-w-lg w-full text-center">
                    <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-6 ${passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {passed ? <CheckCircle size={48} /> : <XCircle size={48} />}
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">{passed ? 'Gefeliciteerd!' : 'Helaas, gezakt'}</h1>
                    <p className="text-gray-600 mb-8">Je scoorde <span className="font-bold">{score}</span> van de {questions.length} punten.</p>

                    <button onClick={() => navigate('/dashboard/examens')} className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2">
                        <Home size={20} /> Terug naar Overzicht
                    </button>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentIndex];
    const isAnswered = feedback !== null;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
            {/* Left: Image & Question */}
            <div className="md:w-1/2 bg-white p-8 flex flex-col justify-center border-r border-gray-200 relative overflow-y-auto">
                <button onClick={() => navigate('/dashboard/examens')} className="absolute top-6 left-6 text-gray-400 hover:text-gray-600 flex items-center gap-2">
                    <Home size={20} /> <span className="text-sm font-bold">Stoppen</span>
                </button>

                <div className="max-w-xl mx-auto w-full mt-10">
                    <span className="text-sm font-bold text-blue-600 mb-4 block">Vraag {currentIndex + 1} / {questions.length}</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 leading-tight">{currentQ.question_text}</h2>

                    {currentQ.question_image && (
                        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-100 mb-6 bg-gray-50">
                            <img src={currentQ.question_image} alt="Vraag" className="w-full h-auto object-contain max-h-[500px]" />

                            {/* Drag & Drop Markers (Overlay) */}
                            {currentQ.question_type === 'drag_drop' && currentQ.answers.map((a, idx) => (
                                (a.x_position !== undefined && a.y_position !== undefined) && (
                                    <button
                                        key={a.id}
                                        onClick={() => !isAnswered && setSelectedOption(a.id)}
                                        className={`absolute w-10 h-10 -ml-5 -mt-5 rounded-full flex items-center justify-center font-bold border-2 shadow-lg transition-transform hover:scale-110 
                                            ${selectedOption === a.id ? 'bg-blue-600 text-white border-white scale-110 z-10' : 'bg-yellow-400 text-yellow-900 border-white'}
                                        `}
                                        style={{ left: `${a.x_position}%`, top: `${a.y_position}%` }}
                                        disabled={isAnswered}
                                    >
                                        {String.fromCharCode(65 + idx)}
                                    </button>
                                )
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Interaction */}
            <div className="md:w-1/2 p-8 bg-gray-50 flex flex-col justify-center">
                <div className="max-w-xl mx-auto w-full space-y-4">

                    {/* OPEN QUESTION INPUT */}
                    {currentQ.question_type === 'open_question' && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Jouw Antwoord</label>
                            <input
                                value={textAnswer}
                                onChange={e => setTextAnswer(e.target.value)}
                                disabled={isAnswered}
                                placeholder="Typ hier je antwoord..."
                                className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 outline-none transition-colors"
                            />
                        </div>
                    )}

                    {/* SELECTABLE OPTIONS (Multiple Choice & Drag Drop List fallback) */}
                    {currentQ.question_type !== 'open_question' && (
                        <div className="space-y-3">
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
                                {currentQ.question_type === 'drag_drop' ? 'Selecteer een positie (klik op foto of hieronder):' : 'Kies het juiste antwoord:'}
                            </p>
                            {currentQ.answers.map((option, idx) => {
                                const isSelected = selectedOption === option.id;
                                let btnClass = "w-full p-5 rounded-xl border-2 text-left font-medium transition-all duration-200 flex items-center gap-4 group ";

                                if (isSelected) {
                                    if (feedback) {
                                        btnClass += feedback.is_correct
                                            ? "border-green-500 bg-green-50 text-green-700"
                                            : "border-red-500 bg-red-50 text-red-700";
                                    } else {
                                        btnClass += "border-blue-600 bg-blue-50 text-blue-700";
                                    }
                                } else {
                                    btnClass += "border-white bg-white hover:border-gray-300 shadow-sm hover:shadow-md";
                                }

                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => setSelectedOption(option.id)}
                                        disabled={isAnswered}
                                        className={btnClass}
                                    >
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border 
                                            ${isSelected ? 'border-current' : 'border-gray-200 text-gray-400 bg-gray-50'}`}>
                                            {String.fromCharCode(65 + idx)}
                                        </span>
                                        <span>{option.answer_text}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* FEEDBACK & CONTROLS */}
                    {!isAnswered ? (
                        <button
                            onClick={submitAnswer}
                            disabled={currentQ.question_type === 'open_question' ? !textAnswer : selectedOption === null}
                            className="w-full py-4 mt-6 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Antwoord Controleren
                        </button>
                    ) : (
                        <div className="space-y-4 animate-fade-in mt-6">
                            <div className={`p-6 rounded-2xl ${feedback?.is_correct ? 'bg-green-100 text-green-900 border border-green-200' : 'bg-red-100 text-red-900 border border-red-200'}`}>
                                <div className="flex items-start gap-4">
                                    <div className={`p-2 rounded-full ${feedback?.is_correct ? 'bg-green-200' : 'bg-red-200'}`}>
                                        {feedback?.is_correct ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">{feedback?.is_correct ? 'Helemaal goed!' : 'Helaas, dat is fout.'}</h3>
                                        {!feedback?.is_correct && (
                                            <div className="text-sm opacity-90">
                                                <p className="mb-2">Het juiste antwoord was: <span className="font-bold">{feedback?.correct_text}</span></p>
                                                {feedback?.explanation && (
                                                    <div className="mt-2 p-3 bg-white/50 rounded-lg border border-white/20 text-sm italic flex gap-2">
                                                        <span>🤖</span> <span>{feedback.explanation}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {feedback?.is_correct && feedback?.explanation && (
                                            <div className="mt-2 text-sm opacity-80 italic">
                                                {feedback.explanation}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={nextQuestion}
                                className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-xl"
                            >
                                {currentIndex === questions.length - 1 ? 'Afronden & Resultaat' : 'Volgende Vraag'} <ArrowRight />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizPage;
