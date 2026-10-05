import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../presentation/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  menuId?: string;
  minLevel?: number;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, menuId, minLevel = 1 }) => {
  const { isAuthenticated, hasPermission, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (menuId && !hasPermission(menuId, minLevel)) return <Navigate to="/unauthorized" replace />;
  return <>{children}</>;
};
