
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSocialVerification } from '@/contexts/SocialVerificationContext';
import MobileFollowFlow from './MobileFollowFlow';

interface MobileAuthGuardProps {
  children: React.ReactNode;
}

const MobileAuthGuard: React.FC<MobileAuthGuardProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { isVerified, setVerified, loading: socialLoading } = useSocialVerification();
  const navigate = useNavigate();
  const location = useLocation();
  const [showFollowFlow, setShowFollowFlow] = useState(false);

  // Check authentication status
  useEffect(() => {
    if (authLoading || socialLoading) return; // Wait for both auth and social verification to load

    // If user is not authenticated, redirect to auth page
    if (!user) {
      sessionStorage.setItem('mobile_intended_destination', location.pathname);
      navigate('/auth', { replace: true });
      return;
    }

    // If user is authenticated but hasn't completed social verification, show follow flow
    if (user && !isVerified) {
      console.log('User authenticated but not socially verified, showing follow flow');
      setShowFollowFlow(true);
      return;
    }

    // User is fully verified, hide follow flow
    setShowFollowFlow(false);
  }, [user, authLoading, socialLoading, isVerified, location.pathname, navigate]);

  const handleFollowFlowComplete = async () => {
    console.log('Follow flow completed');
    await setVerified(true);
    setShowFollowFlow(false);
  };

  // Show loading while auth or social verification is initializing
  if (authLoading || socialLoading) {
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

  // If user needs to complete social verification, show follow flow
  if (showFollowFlow) {
    return <MobileFollowFlow onComplete={handleFollowFlowComplete} />;
  }

  // User is authenticated and verified, show the protected content
  return <>{children}</>;
};

export default MobileAuthGuard;
