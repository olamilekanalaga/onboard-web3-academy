
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Shield, Zap } from "lucide-react";

interface MobileSplashProps {
  onComplete: () => void;
}

const MobileSplash = ({ onComplete }: MobileSplashProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const features = [
    { icon: TrendingUp, text: "Master DeFi & Trading", color: "text-emerald-400" },
    { icon: Shield, text: "Learn Smart Contracts", color: "text-blue-400" },
    { icon: Zap, text: "Earn Real Rewards", color: "text-yellow-400" },
    { icon: Sparkles, text: "Join Web3 Revolution", color: "text-purple-400" }
  ];

  useEffect(() => {
    setIsVisible(true);

    // Cycle through features
    const featureTimer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % features.length);
    }, 800);

    // Auto-advance after 4 seconds
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearInterval(featureTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-16 w-24 h-24 bg-blue-500/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-20 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-yellow-500/20 rounded-full blur-xl animate-bounce"></div>

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {/* Logo Section */}
          <div className="mb-12">
            <div className="relative mb-8">
              <div className="w-32 h-32 mx-auto mb-6 flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="/academia mobile.png" 
                  alt="Academia Mobile" 
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Orbiting elements */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                </div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                </div>
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                </div>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                </div>
              </div>
            </div>

            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Academia
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-2">Your Web3 Learning Journey</p>
            <p className="text-sm text-slate-400">Master crypto, DeFi, and blockchain technology</p>
          </div>

          {/* Feature Showcase */}
          <div className="mb-12">
            <div className="h-16 flex items-center justify-center">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 transition-all duration-500 ${currentStep === index
                        ? 'opacity-100 scale-110 transform'
                        : 'opacity-0 scale-95 absolute'
                      }`}
                  >
                    <div className={`p-3 rounded-full bg-white/10 backdrop-blur-sm ${feature.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-white font-medium text-lg">{feature.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center space-x-2 mb-8">
            {features.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${index === currentStep
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/30'
                  }`}
              />
            ))}
          </div>

          {/* Skip Button */}
          <Button
            onClick={onComplete}
            variant="ghost"
            className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            Skip intro
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileSplash;
