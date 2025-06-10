
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMobileUser } from '@/contexts/MobileUserContext';
import { useAuth } from '@/contexts/AuthContext';
import MobileSplash from './MobileSplash';
import MobileOnboarding from './MobileOnboarding';
import MobileSignup from './MobileSignup';

interface MobileAuthGuardProps {
  children: React.ReactNode;
}

const MobileAuthGuard: React.FC<MobileAuthGuardProps> = ({ children }) => {
  const { userState, completeOnboarding, setCurrentStep } = useMobileUser();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication and onboarding status
  useEffect(() => {
    if (loading) return; // Wait for auth to load

    // If user is not authenticated, redirect to auth page
    if (!user) {
      sessionStorage.setItem('mobile_intended_destination', location.pathname);
      navigate('/auth', { replace: true });
      return;
    }

    // If user is authenticated but hasn't completed onboarding and is on the root path
    if (!userState.hasCompletedOnboarding && location.pathname === '/') {
      // Don't redirect, let the onboarding flow handle it
      return;
    }

    // If user is authenticated and has completed onboarding, allow navigation
    if (userState.hasCompletedOnboarding) {
      // Check if there's an intended destination
      const intendedDestination = sessionStorage.getItem('mobile_intended_destination');
      if (intendedDestination && intendedDestination !== '/' && location.pathname === '/') {
        sessionStorage.removeItem('mobile_intended_destination');
        navigate(intendedDestination, { replace: true });
      }
    }
  }, [user, loading, userState.hasCompletedOnboarding, location.pathname, navigate]);

  // Handle onboarding completion
  const handleSplashComplete = () => {
    setCurrentStep('onboarding');
  };

  const handleOnboardingComplete = () => {
    setCurrentStep('signup');
  };

  const handleSignupComplete = () => {
    completeOnboarding();
    
    // Check if there's an intended destination
    const intendedDestination = sessionStorage.getItem('mobile_intended_destination');
    if (intendedDestination && intendedDestination !== '/') {
      sessionStorage.removeItem('mobile_intended_destination');
      navigate(intendedDestination, { replace: true });
    } else {
      navigate('/mobile/home', { replace: true });
    }
  };

  // Show loading while auth is initializing
  if (loading) {
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

  // If user is authenticated but hasn't completed onboarding and is on root path, show onboarding flow
  if (!userState.hasCompletedOnboarding && location.pathname === '/') {
    switch (userState.currentStep) {
      case 'splash':
        return <MobileSplash onComplete={handleSplashComplete} />;
      case 'onboarding':
        return <MobileOnboarding onComplete={handleOnboardingComplete} />;
      case 'signup':
        return <MobileSignup onComplete={handleSignupComplete} />;
      default:
        return <MobileSplash onComplete={handleSplashComplete} />;
    }
  }

  // User is authenticated, show the protected content
  return <>{children}</>;
};

export default MobileAuthGuard;
