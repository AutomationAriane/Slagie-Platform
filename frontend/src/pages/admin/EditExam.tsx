import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import ExamForm, { ExamData } from '../../components/admin/ExamForm';

const EditExam: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [examData, setExamData] = useState<ExamData | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExam = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8000/api/admin/exams/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setExamData(response.data);
            } catch (err) {
                console.error("Failed to fetch exam", err);
                setFetchError("Kon examen gegevens niet laden.");
            } finally {
                setLoading(false);
            }
        };

        fetchExam();
    }, [id, token]);

    const handleSubmit = async (data: ExamData) => {
        setLoading(true);
        try {
            await axios.put(`http://localhost:8000/api/admin/exams/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/admin');
        } catch (err) {
            console.error("Failed to update exam", err);
            throw err; // ExamForm handles error display
        } finally {
            setLoading(false);
        }
    };

    if (fetchError) {
        return <div className="p-8 text-red-600 text-center">{fetchError}</div>;
    }

    if (!examData && loading) {
        return <div className="p-8 text-center text-gray-500">Examen gegevens laden...</div>;
    }

    return (
        <ExamForm
            initialData={examData}
            onSubmit={handleSubmit}
            isLoading={loading}
            pageTitle="Examen Bewerken"
            submitLabel="Wijzigingen Opslaan"
        />
    );
};

export default EditExam;
