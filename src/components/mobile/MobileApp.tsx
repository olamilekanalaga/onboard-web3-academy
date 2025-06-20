
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
  const [showFollowFlow, setShowFollowFlow] = useState(false);
  const [followFlowCompleted, setFollowFlowCompleted] = useState(false);

  // Check follow flow completion for authenticated users
  useEffect(() => {
    if (loading || !user) return;

    const checkFollowFlowCompletion = async () => {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('follow_flow_completed')
          .eq('id', user.id)
          .single();

        const completed = profile?.follow_flow_completed || false;
        setFollowFlowCompleted(completed);

        if (completed) {
          // Check if there's an intended destination
          const intendedDestination = sessionStorage.getItem('mobile_intended_destination');
          if (intendedDestination && intendedDestination !== '/') {
            sessionStorage.removeItem('mobile_intended_destination');
            navigate(intendedDestination, { replace: true });
          } else {
            navigate('/mobile/home', { replace: true });
          }
        } else {
          setShowFollowFlow(true);
        }
      } catch (error) {
        console.error('Error checking follow flow completion:', error);
        // Default to showing follow flow if there's an error
        setShowFollowFlow(true);
      }
    };

    checkFollowFlowCompletion();
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

  // Show follow flow if user hasn't completed it
  if (user && showFollowFlow && !followFlowCompleted) {
    return <MobileFollowFlow onComplete={handleFollowFlowComplete} />;
  }

  // User is authenticated and completed follow flow, show mobile home
  return <MobileHome />;
};

export default MobileApp;
