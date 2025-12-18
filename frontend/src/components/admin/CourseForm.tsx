import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, X, Image as ImageIcon, HelpCircle, Video, FileText, ChevronDown, ChevronRight, Layers, Clock } from 'lucide-react';

export interface Lesson {
    id?: number;
    title: string;
    content: string;
    video_url: string;
    duration_minutes: number;
    order: number;
}

export interface Module {
    id?: number;
    title: string;
    order: number;
    lessons: Lesson[];
}

export interface CourseData {
    id?: number;
    title: string;
    description: string;
    cover_image: string;
    is_published: boolean;
    modules: Module[];
}

interface CourseFormProps {
    initialData?: CourseData;
    onSubmit: (data: CourseData) => Promise<void>;
    isLoading: boolean;
    pageTitle: string;
    submitLabel: string;
}

const CourseForm: React.FC<CourseFormProps> = ({ initialData, onSubmit, isLoading, pageTitle, submitLabel }) => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [expandedModules, setExpandedModules] = useState<number[]>([]);

    // Form State
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [coverImage, setCoverImage] = useState(initialData?.cover_image || '');
    const [isPublished, setIsPublished] = useState(initialData?.is_published || false);

    // Default One Module
    const [modules, setModules] = useState<Module[]>(initialData?.modules || [
        {
            title: 'Module 1: Introductie',
            order: 0,
            lessons: [
                { title: 'Welkom bij de cursus', content: '', video_url: '', duration_minutes: 5, order: 0 }
            ]
        }
    ]);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description || '');
            setCoverImage(initialData.cover_image || '');
            setIsPublished(initialData.is_published || false);
            if (initialData.modules) {
                setModules(initialData.modules);
            }
        }
    }, [initialData]);

    const toggleModuleExp = (index: number) => {
        if (expandedModules.includes(index)) {
            setExpandedModules(expandedModules.filter(i => i !== index));
        } else {
            setExpandedModules([...expandedModules, index]);
        }
    };

    // --- Module Actions ---
    const addModule = () => {
        const newMod: Module = {
            title: `Module ${modules.length + 1}`,
            order: modules.length,
            lessons: []
        };
        setModules([...modules, newMod]);
        setExpandedModules([...expandedModules, modules.length]); // Expand new
    };

    const removeModule = (index: number) => {
        const newModules = [...modules];
        newModules.splice(index, 1);
        setModules(newModules);
    };

    const updateModule = (index: number, field: keyof Module, value: any) => {
        const newModules = [...modules];
        newModules[index] = { ...newModules[index], [field]: value };
        setModules(newModules);
    };

    // --- Lesson Actions ---
    const addLesson = (mIndex: number) => {
        const newModules = [...modules];
        newModules[mIndex].lessons.push({
            title: 'Nieuwe Les',
            content: '',
            video_url: '',
            duration_minutes: 10,
            order: newModules[mIndex].lessons.length
        });
        setModules(newModules);
    };

    const removeLesson = (mIndex: number, lIndex: number) => {
        const newModules = [...modules];
        newModules[mIndex].lessons.splice(lIndex, 1);
        setModules(newModules);
    };

    const updateLesson = (mIndex: number, lIndex: number, field: keyof Lesson, value: any) => {
        const newModules = [...modules];
        const lessons = newModules[mIndex].lessons;
        lessons[lIndex] = { ...lessons[lIndex], [field]: value };
        setModules(newModules);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!title.trim()) {
            setError('Cursustitel is verplicht');
            return;
        }

        const payload: CourseData = {
            id: initialData?.id,
            title,
            description,
            cover_image: coverImage,
            is_published: isPublished,
            modules: modules.map((m, i) => ({
                ...m,
                order: i,
                lessons: m.lessons.map((l, j) => ({
                    ...l,
                    order: j
                }))
            }))
        };

        try {
            await onSubmit(payload);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.detail || 'Kon cursus niet opslaan');
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
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Publiceren:</label>
                        <button
                            type="button"
                            onClick={() => setIsPublished(!isPublished)}
                            className={`w-12 h-6 rounded-full transition-colors relative ${isPublished ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${isPublished ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>
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
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
                        <X size={20} />
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: General Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <HelpCircle size={20} className="text-blue-500" />
                                Algemene Informatie
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Cursus Titel"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Beschrijving</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Wat leren studenten?"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cover Afbeelding (URL)</label>
                                    <input
                                        type="text"
                                        value={coverImage}
                                        onChange={(e) => setCoverImage(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Modules Builder */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Cursus Inhoud (Modules & Lessen)</h2>
                            <button
                                onClick={addModule}
                                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition-colors flex items-center gap-2"
                            >
                                <Plus size={18} />
                                Module Toevoegen
                            </button>
                        </div>

                        {modules.map((module, mIndex) => (
                            <div key={mIndex} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                {/* Module Header */}
                                <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center gap-4">
                                    <button onClick={() => toggleModuleExp(mIndex)} className="text-gray-500 hover:text-gray-800">
                                        {expandedModules.includes(mIndex) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                    </button>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Layers size={16} className="text-blue-500" />
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Module {mIndex + 1}</span>
                                        </div>
                                        <input
                                            type="text"
                                            value={module.title}
                                            onChange={(e) => updateModule(mIndex, 'title', e.target.value)}
                                            className="w-full bg-transparent border-none p-0 text-lg font-bold text-gray-900 focus:ring-0 placeholder-gray-400"
                                            placeholder="Module Titel"
                                        />
                                    </div>

                                    <button onClick={() => removeModule(mIndex)} className="p-2 text-gray-400 hover:text-red-500">
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                {/* Lessons List */}
                                {expandedModules.includes(mIndex) && (
                                    <div className="p-6 space-y-4 bg-white">
                                        {module.lessons.map((lesson, lIndex) => (
                                            <div key={lIndex} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors relative group">
                                                <button
                                                    onClick={() => removeLesson(mIndex, lIndex)}
                                                    className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                >
                                                    <X size={18} />
                                                </button>

                                                <div className="flex gap-4">
                                                    <div className="mt-1 w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center flex-shrink-0">
                                                        {lIndex + 1}
                                                    </div>
                                                    <div className="flex-1 space-y-4">
                                                        <input
                                                            type="text"
                                                            value={lesson.title}
                                                            onChange={(e) => updateLesson(mIndex, lIndex, 'title', e.target.value)}
                                                            className="w-full font-semibold text-gray-900 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                                                            placeholder="Les Titel"
                                                        />

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-1">
                                                                    <Video size={12} />
                                                                    Video URL
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={lesson.video_url || ''}
                                                                    onChange={(e) => updateLesson(mIndex, lIndex, 'video_url', e.target.value)}
                                                                    className="w-full text-sm px-3 py-1.5 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500"
                                                                    placeholder="Bijv. YouTube/Vimeo"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-1">
                                                                    <Clock size={12} />
                                                                    Duur (min)
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    value={lesson.duration_minutes}
                                                                    onChange={(e) => updateLesson(mIndex, lIndex, 'duration_minutes', Number(e.target.value))}
                                                                    className="w-full text-sm px-3 py-1.5 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500"
                                                                />
                                                            </div>
                                                            <div className="col-span-2">
                                                                <label className="flex items-center gap-1 text-xs font-medium text-gray-500 mb-1">
                                                                    <FileText size={12} />
                                                                    Tekst Inhoud
                                                                </label>
                                                                <textarea
                                                                    value={lesson.content || ''}
                                                                    onChange={(e) => updateLesson(mIndex, lIndex, 'content', e.target.value)}
                                                                    rows={2}
                                                                    className="w-full text-sm px-3 py-1.5 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500"
                                                                    placeholder="Beschrijving of inhoud van de les..."
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            onClick={() => addLesson(mIndex)}
                                            className="w-full py-3 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                                        >
                                            <Plus size={16} />
                                            Les Toevoegen
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseForm;
