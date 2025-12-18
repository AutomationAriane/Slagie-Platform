import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import ExamForm, { ExamData } from '../../components/admin/ExamForm';

const CreateExam: React.FC = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data: ExamData) => {
        setLoading(true);
        try {
            await axios.post('http://localhost:8000/api/admin/exams', data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/admin');
        } catch (err) {
            console.error("Failed to create exam", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <ExamForm
            onSubmit={handleSubmit}
            isLoading={loading}
            pageTitle="Nieuw Examen"
            submitLabel="Aanmaken"
        />
    );
};

export default CreateExam;
