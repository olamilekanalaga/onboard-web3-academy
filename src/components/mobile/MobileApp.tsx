
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import MobileAuth from "./MobileAuth";
import MobileHome from "./MobileHome";

const MobileApp = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Handle navigation for authenticated users
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

  // User is authenticated, show mobile home
  return <MobileHome />;
};

export default MobileApp;
