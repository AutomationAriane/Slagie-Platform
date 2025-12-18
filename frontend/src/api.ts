import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to attach JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export interface Exam {
    id: number;
    title: string;
    description: string;
    cover_image?: string;
    time_limit?: number;
    passing_score?: number;
    category?: string;
    is_published?: boolean;
    question_count?: number;
}

export interface Question {
    id: number;
    question_text: string;
    question_image: string | null;
    question_type: 'multiple_choice' | 'drag_drop' | 'open_question';
    cbr_topic?: string;
    explanation?: string;
    answers: {
        id: number;
        answer_text: string;
        order: number;
        x_position?: number;
        y_position?: number;
    }[];
}

export interface CheckAnswerResponse {
    is_correct: boolean;
    correct_answer_text: string;
    explanation?: string;
}

export const getExams = async () => {
    const response = await api.get<Exam[]>('/student/exams');
    return response.data;
};

export interface ChatArtifact {
    type: string;
    data: any;
}

export interface ChatResponse {
    text: string;
    artifact?: ChatArtifact;
}

export const sendChatMessage = async (message: string) => {
    const response = await api.post<ChatResponse>('/student/chat', { message });
    return response.data;
};

export const startCbrExam = async () => {
    const response = await api.post<Exam>('/student/exams/cbr-simulation');
    return response.data;
};

export const startExam = async (examId: string) => {
    const response = await api.get<{ questions: Question[] }>(`/student/exams/${examId}/start`);
    return response.data.questions;
};

export const checkAnswer = async (questionId: number, selectedOptionId?: number, answerText?: string) => {
    const response = await api.post<CheckAnswerResponse>('/student/exams/check-answer', {
        question_id: questionId,
        selected_option_id: selectedOptionId,
        answer_text: answerText
    });
    return response.data;
};

export interface TopicProgress {
    topic: string;
    total_answered: number;
    total_correct: number;
    percentage: number;
}

export interface ExamHistoryItem {
    id: number;
    exam_title: string;
    score: number;
    max_score: number;
    is_passed: boolean;
    completed_at: string;
}

export const getStudentProgress = async () => {
    const response = await api.get<TopicProgress[]>('/student/progress');
    return response.data;
};

export const getExamHistory = async () => {
    const response = await api.get<ExamHistoryItem[]>('/student/history');
    return response.data;
};

export const finishExam = async (examId: string, score: number, total: number) => {
    const response = await api.post(`/exams/${examId}/finish`, {
        score,
        total
    });
    return response.data;
};

export const deleteExam = async (examId: number) => {
    await api.delete(`/student/exams/${examId}`);
};
