import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const AuthGuard = ({ children }) => {
  const { isAuthenticated, isAdminAuthenticated, checkAuthStatus } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      try {
        // Check authentication status
        await checkAuthStatus();
        setAuthChecked(true);
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authChecked) {
      initializeAuth();
    }
  }, [checkAuthStatus, authChecked]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          <div className="text-center">
            <p className="text-gray-600 font-medium">Initializing Application...</p>
            <p className="text-gray-500 text-sm mt-2">Verifying authentication status</p>
          </div>
        </div>
      </div>
    );
  }

  // If we're on login/register pages, allow access regardless of auth status
  const publicRoutes = ['/login', '/admin-login'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  if (isPublicRoute) {
    return children;
  }

  // For all other routes, check if user is authenticated
  // If not authenticated, they will be handled by ProtectedRoute components
  return children;
};

export default AuthGuard;
