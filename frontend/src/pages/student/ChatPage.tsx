import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { sendChatMessage, ChatResponse, ChatArtifact } from '../../api';
import { Send, User as UserIcon, Bot, Home, CheckCircle, XCircle } from 'lucide-react';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
    artifact?: ChatArtifact;
}

const ChatPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: `Hoi ${user?.email?.split('@')[0] || 'student'}! Ik ben je persoonlijke rij-instructeur. Waar wil je mee oefenen?`, sender: 'ai' }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const response = await sendChatMessage(userMsg.text);
            const aiMsg: Message = {
                id: Date.now() + 1,
                text: response.text,
                sender: 'ai',
                artifact: response.artifact
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { id: Date.now(), text: "Sorry, ik kon de server niet bereiken.", sender: 'ai' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0A66FF] rounded-full flex items-center justify-center text-white">
                        <Bot size={24} />
                    </div>
                    <div>
                        <h1 className="font-bold text-gray-800">AI Rij-instructeur</h1>
                        <p className="text-xs text-green-500 font-bold flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
                        </p>
                    </div>
                </div>
                <button onClick={() => navigate('/dashboard')} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                    <Home size={24} />
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 shadow-sm ${msg.sender === 'user'
                                ? 'bg-[#0A66FF] text-white rounded-br-none'
                                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                            }`}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>

                            {/* ARTIFACT RENDERING */}
                            {msg.artifact && msg.artifact.type === 'question' && (
                                <div className="mt-4 bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                                    <div className="p-3 border-b border-gray-200 bg-gray-100 flex justify-between items-center">
                                        <span className="text-xs font-bold uppercase text-gray-500">Oefenvraag</span>
                                        <span className="text-xs font-bold text-blue-600">{msg.artifact.data.question_type}</span>
                                    </div>
                                    {msg.artifact.data.question_image && (
                                        <div className="h-40 overflow-hidden bg-gray-200">
                                            <img src={msg.artifact.data.question_image} className="w-full h-full object-cover" alt="Situatie" />
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-900 mb-3 text-sm">{msg.artifact.data.question_text}</h3>
                                        <div className="space-y-2">
                                            {msg.artifact.data.answers.map((ans: any) => (
                                                <div key={ans.id} className="p-2 rounded border border-gray-200 bg-white text-sm text-gray-700">
                                                    {ans.text}
                                                </div>
                                            ))}
                                        </div>
                                        <button className="mt-4 w-full py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700">
                                            Maak volledig examen
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1 items-center">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="bg-white p-4 border-t border-gray-200">
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="max-w-4xl mx-auto relative flex items-center gap-2"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Vraag bijvoorbeeld: 'Heb ik voorrang op een T-splitsing?'"
                        className="flex-1 bg-gray-100 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0A66FF] outline-none transition-all"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="p-3 bg-[#0A66FF] text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatPage;
