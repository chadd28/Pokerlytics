import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';

/**
 * ProtectedRoute - Redirects to login if user isn't authenticated
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The protected component to render
 */
const ProtectedRoute = ({ children }) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated();
        setIsAuthed(authenticated);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthed(false);
      } finally {
        setAuthChecked(true);
      }
    };
    
    checkAuth();
  }, []);

  // Show loading state while checking auth
  if (!authChecked) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  // Simple redirect to login if not authenticated
  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }
  
  // Render the protected content if authenticated
  return children;
};

export default ProtectedRoute;