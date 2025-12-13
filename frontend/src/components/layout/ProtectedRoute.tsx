import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: 'student' | 'admin';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const { token, user, isLoading } = useAuth();

    // Show nothing while checking auth state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Laden...</p>
                </div>
            </div>
        );
    }

    // Not logged in - redirect to login
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // Check role if specified
    if (requiredRole && user.role !== requiredRole) {
        // Redirect to their appropriate dashboard
        const redirectPath = user.role === 'admin' ? '/admin' : '/dashboard';
        return <Navigate to={redirectPath} replace />;
    }

    // All checks passed - render the protected content
    return <>{children}</>;
};
