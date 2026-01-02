import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spinner } from '@heroui/react';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component that guards admin routes
 * Redirects unauthenticated users to login page
 * Shows loading spinner while checking authentication status
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading, error } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" color="primary" />
          <p className="text-default-500">Verifying authentication...</p>
          {error && (
            <p className="text-danger-500 text-sm max-w-md text-center">
              {error.message}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the attempted location so we can redirect back after login
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}