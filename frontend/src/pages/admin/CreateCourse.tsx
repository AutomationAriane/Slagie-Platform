import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import CourseForm, { CourseData } from '../../components/admin/CourseForm';

const CreateCourse: React.FC = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data: CourseData) => {
        setLoading(true);
        try {
            await axios.post('http://localhost:8000/api/courses', data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/admin'); // Or back to course list
        } catch (err) {
            console.error("Failed to create course", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <CourseForm
            onSubmit={handleSubmit}
            isLoading={loading}
            pageTitle="Nieuwe Cursus"
            submitLabel="Aanmaken"
        />
    );
};

export default CreateCourse;
