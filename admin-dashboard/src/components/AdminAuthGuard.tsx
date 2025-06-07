import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Shield } from 'lucide-react';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-700 mb-2">Loading Admin Dashboard...</h2>
          <p className="text-slate-500">Verifying your admin credentials</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated or not admin, redirect to login
  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated admin, render the protected content
  return <>{children}</>;
};

export default AdminAuthGuard;
