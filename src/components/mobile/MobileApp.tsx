
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import MobileAuth from "./MobileAuth";
import MobileHome from "./MobileHome";

const MobileApp = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

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

  // If user is authenticated, show mobile home
  if (user) {
    return <MobileHome />;
  }

  // If not authenticated, show mobile auth
  return <MobileAuth />;
};

export default MobileApp;
