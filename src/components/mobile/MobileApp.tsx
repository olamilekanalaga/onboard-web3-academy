
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import MobileAuth from "./MobileAuth";
import MobileHome from "./MobileHome";
import MobileSplash from "./MobileSplash";
import MobileOnboarding from "./MobileOnboarding";

const MobileApp = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Handle post-authentication navigation
  useEffect(() => {
    if (loading || !user) return;

    // Check if there's an intended destination
    const intendedDestination = sessionStorage.getItem('mobile_intended_destination');
    if (intendedDestination && intendedDestination !== '/') {
      sessionStorage.removeItem('mobile_intended_destination');
      navigate(intendedDestination, { replace: true });
    } else {
      navigate('/mobile/home', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleSplashComplete = () => {
    setShowSplash(false);
    if (!user) {
      setShowOnboarding(true);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

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

  // Show splash screen first
  if (showSplash) {
    return <MobileSplash onComplete={handleSplashComplete} />;
  }

  // Show onboarding for non-authenticated users
  if (!user && showOnboarding) {
    return <MobileOnboarding onComplete={handleOnboardingComplete} />;
  }

  // If user is not authenticated, show mobile auth
  if (!user) {
    return <MobileAuth />;
  }

  // User is authenticated, show mobile home
  return <MobileHome />;
};

export default MobileApp;
