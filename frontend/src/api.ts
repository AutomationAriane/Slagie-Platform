import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface Exam {
    id: number;
    title: string;
    description: string;
    question_count: number;
}

export interface Question {
    id: number;
    text: string;
    image_url: string | null;
    options: {
        id: number;
        text: string;
        label: string;
    }[];
}

export interface CheckAnswerResponse {
    is_correct: boolean;
    correct_answer_text: string;
}

export const getExams = async () => {
    const response = await api.get<Exam[]>('/exams');
    return response.data;
};

export const startExam = async (examId: string) => {
    const response = await api.get<Question[]>(`/exams/${examId}/start`);
    return response.data;
};

export const checkAnswer = async (questionId: number, selectedOptionId: number) => {
    const response = await api.post<CheckAnswerResponse>('/exams/check-answer', {
        question_id: questionId,
        selected_option_id: selectedOptionId,
    });
    return response.data;
};

export const finishExam = async (examId: string, score: number, total: number) => {
    const response = await api.post(`/exams/${examId}/finish`, {
        score,
        total
    });
    return response.data;
};
