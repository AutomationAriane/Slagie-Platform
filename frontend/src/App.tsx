import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import CreateExam from './pages/admin/CreateExam';
import EditExam from './pages/admin/EditExam';
import CreateCourse from './pages/admin/CreateCourse';
import EditCourse from './pages/admin/EditCourse';
import QuizPage from './pages/student/QuizPage';
import ChatPage from './pages/student/ChatPage';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* Student Routes */}
                    <Route
                        path="/dashboard/chat"
                        element={
                            <ProtectedRoute requiredRole="student">
                                <ChatPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/dashboard/examens"
                        element={
                            <ProtectedRoute requiredRole="student">
                                <StudentDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/dashboard/examens/:examId"
                        element={
                            <ProtectedRoute requiredRole="student">
                                <QuizPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={<Navigate to="/dashboard/examens" replace />}
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
                    <Route
                        path="/admin/exams/:id/edit"
                        element={
                            <ProtectedRoute requiredRole="admin">
                                <EditExam />
                            </ProtectedRoute>
                        }
                    />

                    {/* Course Routes */}
                    <Route
                        path="/admin/create-course"
                        element={
                            <ProtectedRoute requiredRole="admin">
                                <CreateCourse />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/courses/:id/edit"
                        element={
                            <ProtectedRoute requiredRole="admin">
                                <EditCourse />
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
