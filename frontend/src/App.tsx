import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import CreateExam from './pages/admin/CreateExam';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* Student Routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute requiredRole="student">
                                <StudentDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin Routes */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute requiredRole="admin">
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/create-exam"
                        element={
                            <ProtectedRoute requiredRole="admin">
                                <CreateExam />
                            </ProtectedRoute>
                        }
                    />

                    {/* Redirects */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
