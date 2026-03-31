import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children, requiredRole = 'user', adminOnly = false }) => {
  const { token, userData, aToken } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuthentication = async () => {
      setIsLoading(true);
      console.log('🔍 ProtectedRoute checking auth...');
      console.log('🔍 Token:', token ? 'exists' : 'missing');
      console.log('🔍 Admin token:', aToken ? 'exists' : 'missing');
      console.log('🔍 Admin only:', adminOnly);
      
      // Check for user authentication
      if (adminOnly) {
        // Admin routes require admin token
        if (!aToken) {
          console.log('🔐 Admin authentication required - redirecting to admin login');
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        setIsAuthenticated(true);
      } else {
        // User routes require user token only
        if (!token) {
          console.log('🔐 User authentication required - redirecting to login');
          console.log('Token check:', { token: !!token, aToken: !!aToken });
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        
        console.log('✅ Token found, allowing access');
        setIsAuthenticated(true);
      }
      
      setIsLoading(false);
    };

    checkAuthentication();
  }, [token, aToken, adminOnly]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to appropriate login if not authenticated
  if (!isAuthenticated) {
    if (adminOnly) {
      toast.error('Admin authentication required');
      return <Navigate to="/admin-login" state={{ from: location }} replace />;
    } else {
      toast.error('Please login to access this page');
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  // Check role-based access if userData is available
  if (userData && requiredRole && userData.role && userData.role !== requiredRole) {
    console.log('🔍 Role check failed:', {
      userRole: userData.role,
      requiredRole,
      userData: userData
    });
    toast.error(`Access denied. ${requiredRole} role required.`);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
