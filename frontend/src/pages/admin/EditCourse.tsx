import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import CourseForm, { CourseData } from '../../components/admin/CourseForm';

const EditCourse: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [courseData, setCourseData] = useState<CourseData | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourse = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8000/api/courses/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCourseData(response.data);
            } catch (err) {
                console.error("Failed to fetch course", err);
                setFetchError("Kon cursus gegevens niet laden.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id, token]);

    const handleSubmit = async (data: CourseData) => {
        setLoading(true);
        try {
            await axios.put(`http://localhost:8000/api/courses/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/admin');
        } catch (err) {
            console.error("Failed to update course", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    if (fetchError) {
        return <div className="p-8 text-red-600 text-center">{fetchError}</div>;
    }

    if (!courseData && loading) {
        return <div className="p-8 text-center text-gray-500">Cursus gegevens laden...</div>;
    }

    return (
        <CourseForm
            initialData={courseData}
            onSubmit={handleSubmit}
            isLoading={loading}
            pageTitle="Cursus Bewerken"
            submitLabel="Wijzigingen Opslaan"
        />
    );
};

export default EditCourse;
