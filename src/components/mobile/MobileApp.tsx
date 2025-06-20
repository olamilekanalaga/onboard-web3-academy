
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import MobileAuth from "./MobileAuth";
import MobileHome from "./MobileHome";
import MobileSplash from "./MobileSplash";
import MobileOnboarding from "./MobileOnboarding";
import MobileFollowFlow from "./MobileFollowFlow";

const MobileApp = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check follow flow completion for authenticated users
  useEffect(() => {
    if (loading) return;

    // If user is authenticated, navigate to home
    if (user) {
      // Check if there's an intended destination
      const intendedDestination = sessionStorage.getItem('mobile_intended_destination');
      if (intendedDestination && intendedDestination !== '/') {
        sessionStorage.removeItem('mobile_intended_destination');
        navigate(intendedDestination, { replace: true });
      } else {
        navigate('/mobile/home', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setHasShownSplash(true);
    if (!user) {
      setShowOnboarding(true);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  const handleFollowFlowComplete = () => {
    setShowFollowFlow(false);
    setFollowFlowCompleted(true);
    navigate('/mobile/home', { replace: true });
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

  // Show splash screen first (only if not shown before)
  if (showSplash && !hasShownSplash) {
    return <MobileSplash onComplete={handleSplashComplete} />;
  }

  // Show onboarding for non-authenticated users (only if splash was completed)
  if (!user && showOnboarding && hasShownSplash) {
    return <MobileOnboarding onComplete={handleOnboardingComplete} />;
  }

  // If user is not authenticated, show mobile auth
  if (!user) {
    return <MobileAuth />;
  }

  // Show follow flow if user hasn't completed it
  if (user && showFollowFlow && !followFlowCompleted) {
    return <MobileFollowFlow onComplete={handleFollowFlowComplete} />;
  }

  // User is authenticated and completed follow flow, show mobile home
  return <MobileHome />;
};

export default MobileApp;
