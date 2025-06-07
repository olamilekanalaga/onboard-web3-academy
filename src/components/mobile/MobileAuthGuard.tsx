import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMobileUser } from '@/contexts/MobileUserContext';
import MobileSplash from './MobileSplash';
import MobileOnboarding from './MobileOnboarding';
import MobileSignup from './MobileSignup';

interface MobileAuthGuardProps {
  children: React.ReactNode;
}

const MobileAuthGuard: React.FC<MobileAuthGuardProps> = ({ children }) => {
  const { userState, completeOnboarding, setCurrentStep } = useMobileUser();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user has completed onboarding
  useEffect(() => {
    // If user hasn't completed onboarding and is trying to access protected routes
    if (!userState.hasCompletedOnboarding && location.pathname !== '/') {
      // Store the intended destination
      sessionStorage.setItem('mobile_intended_destination', location.pathname);
      // Redirect to onboarding flow
      navigate('/', { replace: true });
    }
  }, [userState.hasCompletedOnboarding, location.pathname, navigate]);

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

  // If user hasn't completed onboarding, show onboarding flow
  if (!userState.hasCompletedOnboarding) {
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

  // User has completed onboarding, show the protected content
  return <>{children}</>;
};

export default MobileAuthGuard;
