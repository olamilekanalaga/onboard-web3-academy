
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMobileUser } from "@/contexts/MobileUserContext";
import { useEffect } from "react";
import MobileAuth from "./MobileAuth";
import MobileHome from "./MobileHome";
import MobileSplash from "./MobileSplash";
import MobileOnboarding from "./MobileOnboarding";
import MobileSignup from "./MobileSignup";

const MobileApp = () => {
  const { user, loading } = useAuth();
  const { userState, completeOnboarding, setCurrentStep } = useMobileUser();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle navigation for authenticated users
  useEffect(() => {
    if (loading) return;

    // If user is authenticated and has completed onboarding
    if (user && userState.hasCompletedOnboarding) {
      // Check if there's an intended destination
      const intendedDestination = sessionStorage.getItem('mobile_intended_destination');
      if (intendedDestination && intendedDestination !== '/') {
        sessionStorage.removeItem('mobile_intended_destination');
        navigate(intendedDestination, { replace: true });
      } else {
        navigate('/mobile/home', { replace: true });
      }
    }
  }, [user, loading, userState.hasCompletedOnboarding, navigate]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full animate-pulse mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show mobile auth
  if (!user) {
    return <MobileAuth />;
  }

  // If user is authenticated but hasn't completed onboarding, show onboarding flow
  if (!userState.hasCompletedOnboarding) {
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

  // User is authenticated and has completed onboarding, show mobile home
  return <MobileHome />;
};

export default MobileApp;
