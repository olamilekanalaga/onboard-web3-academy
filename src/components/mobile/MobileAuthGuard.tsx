
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface MobileAuthGuardProps {
  children: React.ReactNode;
}

const MobileAuthGuard: React.FC<MobileAuthGuardProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication status
  useEffect(() => {
    if (authLoading) return; // Wait for auth to load

    // If user is not authenticated, redirect to auth page
    if (!user) {
      sessionStorage.setItem('mobile_intended_destination', location.pathname);
      navigate('/auth', { replace: true });
      return;
    }
  }, [user, authLoading, location.pathname, navigate]);

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // If user is not authenticated, don't render anything (will redirect to auth)
  if (!user) {
    return null;
  }

  // User is authenticated, show the protected content
  return <>{children}</>;
};

export default MobileAuthGuard;
