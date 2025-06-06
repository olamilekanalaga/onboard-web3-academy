
import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";

interface MobileSplashProps {
  onComplete: () => void;
}

const MobileSplash = ({ onComplete }: MobileSplashProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="text-center text-white space-y-6">
        <div className="bg-white/20 p-6 rounded-full mx-auto w-24 h-24 flex items-center justify-center backdrop-blur-sm">
          <BookOpen className="h-12 w-12 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">Onboard</h1>
          <p className="text-blue-100 text-lg">Master Web3, Build Your Future</p>
        </div>
        <div className="flex justify-center space-x-2 mt-8">
          <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default MobileSplash;
