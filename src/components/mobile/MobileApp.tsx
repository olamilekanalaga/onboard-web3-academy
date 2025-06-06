
import { useState } from "react";
import MobileSplash from "./MobileSplash";
import MobileOnboarding from "./MobileOnboarding";
import MobileSignup from "./MobileSignup";
import MobileHome from "./MobileHome";

const MobileApp = () => {
  const [currentStep, setCurrentStep] = useState<'splash' | 'onboarding' | 'signup' | 'home'>('splash');

  const handleSplashComplete = () => {
    setCurrentStep('onboarding');
  };

  const handleOnboardingComplete = () => {
    setCurrentStep('signup');
  };

  const handleSignupComplete = () => {
    setCurrentStep('home');
  };

  switch (currentStep) {
    case 'splash':
      return <MobileSplash onComplete={handleSplashComplete} />;
    case 'onboarding':
      return <MobileOnboarding onComplete={handleOnboardingComplete} />;
    case 'signup':
      return <MobileSignup onComplete={handleSignupComplete} />;
    case 'home':
      return <MobileHome />;
    default:
      return <MobileSplash onComplete={handleSplashComplete} />;
  }
};

export default MobileApp;
