import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { startExam, checkAnswer, finishExam, Question } from '../../api';
import { ArrowRight, CheckCircle, XCircle, AlertCircle, Home } from 'lucide-react';

const QuizPage = () => {
    const { examId } = useParams();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    // Quiz State
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<{ is_correct: boolean; correct_text: string } | null>(null);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        const initQuiz = async () => {
            if (!examId) return;
            try {
                const data = await startExam(examId);
                setQuestions(data);
            } catch (error) {
                console.error("Error starting quiz", error);
            } finally {
                setLoading(false);
            }
        };
        initQuiz();
    }, [examId]);

    const handleAnswer = async (optionId: number) => {
        if (selectedOption !== null) return; // Prevent double click
        setSelectedOption(optionId);

        // Optimistic UI or wait for backend? User asked for backend check.
        try {
            const result = await checkAnswer(questions[currentIndex].id, optionId);
            setFeedback({
                is_correct: result.is_correct,
                correct_text: result.correct_answer_text
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

    if (loading) return <div className="h-screen flex items-center justify-center text-slagie-teal font-bold">Quiz laden...</div>;
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

                    <button onClick={() => navigate('/student/dashboard')} className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2">
                        <Home size={20} /> Terug naar Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentIndex];

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
            {/* Left: Image & Text */}
            <div className="md:w-1/2 bg-white p-8 flex flex-col justify-center border-r border-gray-200">
                <div className="max-w-xl mx-auto w-full">
                    <span className="text-sm font-bold text-slagie-teal mb-4 block">Vraag {currentIndex + 1} / {questions.length}</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 leading-tight">{currentQ.text}</h2>

                    {currentQ.image_url && (
                        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 mb-6">
                            <img src={currentQ.image_url} alt="Vraag" className="w-full h-auto object-cover" />
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Options & Interaction */}
            <div className="md:w-1/2 p-8 bg-gray-50 flex flex-col justify-center">
                <div className="max-w-xl mx-auto w-full space-y-4">
                    {currentQ.options.map(option => {
                        const isSelected = selectedOption === option.id;
                        let btnClass = "w-full p-6 rounded-xl border-2 text-left font-medium transition-all duration-200 flex items-center gap-4 group ";

                        if (isSelected) {
                            if (feedback) {
                                btnClass += feedback.is_correct
                                    ? "border-green-500 bg-green-50 text-green-700"
                                    : "border-red-500 bg-red-50 text-red-700";
                            } else {
                                btnClass += "border-slagie-teal bg-teal-50 text-slagie-teal";
                            }
                        } else {
                            btnClass += "border-white bg-white hover:border-gray-300 shadow-sm";
                        }

                        return (
                            <button
                                key={option.id}
                                onClick={() => handleAnswer(option.id)}
                                disabled={selectedOption !== null}
                                className={btnClass}
                            >
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border ${isSelected ? 'border-current' : 'border-gray-200 text-gray-400'}`}>
                                    {option.label}
                                </span>
                                <span>{option.text}</span>
                            </button>
                        );
                    })}

                    {/* Feedback Box */}
                    {feedback && (
                        <div className={`mt-6 p-6 rounded-xl ${feedback.is_correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} animate-fade-in`}>
                            <div className="flex items-start gap-3">
                                {feedback.is_correct ? <CheckCircle className="shrink-0" /> : <AlertCircle className="shrink-0" />}
                                <div>
                                    <p className="font-bold mb-1">{feedback.is_correct ? 'Helemaal goed!' : 'Helaas, dat is fout.'}</p>
                                    {!feedback.is_correct && <p className="text-sm">Het juiste antwoord was: <b>{feedback.correct_text}</b></p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Next Button */}
                    {feedback && (
                        <button
                            onClick={nextQuestion}
                            className="w-full py-4 mt-6 bg-slagie-teal text-white rounded-xl font-bold text-lg hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
                        >
                            {currentIndex === questions.length - 1 ? 'Afronden' : 'Volgende Vraag'} <ArrowRight />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizPage;
