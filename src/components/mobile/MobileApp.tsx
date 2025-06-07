
import { useNavigate } from "react-router-dom";
import { useMobileUser } from "@/contexts/MobileUserContext";
import MobileSplash from "./MobileSplash";
import MobileOnboarding from "./MobileOnboarding";
import MobileSignup from "./MobileSignup";

const MobileApp = () => {
  const { userState, completeOnboarding, setCurrentStep } = useMobileUser();
  const navigate = useNavigate();

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
    case 'home':
      // If we reach here, redirect to mobile home
      navigate('/mobile/home', { replace: true });
      return null;
    default:
      return <MobileSplash onComplete={handleSplashComplete} />;
  }
};

export default MobileApp;
