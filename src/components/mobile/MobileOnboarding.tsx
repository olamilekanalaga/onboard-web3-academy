
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Coins,
  Shield,
  Users,
  Trophy,
  Zap,
  ChevronRight,
  DollarSign,
  BookOpen,
  Target
} from "lucide-react";

interface MobileOnboardingProps {
  onComplete: () => void;
}

const MobileOnboarding = ({ onComplete }: MobileOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const onboardingSteps = [
    {
      icon: TrendingUp,
      title: "Master DeFi Trading",
      subtitle: "Learn from the pros",
      description: "Discover yield farming, liquidity mining, and advanced trading strategies that generate real returns in the DeFi ecosystem.",
      bgGradient: "from-emerald-400 via-emerald-500 to-emerald-600",
      features: ["Yield Farming", "DEX Trading", "Risk Management"],
      stats: { value: "$2.1B+", label: "DeFi Volume Traded" },
      floatingElements: [
        { emoji: "💰", delay: "0s", position: "top-10 left-10" },
        { emoji: "📈", delay: "0.5s", position: "top-20 right-16" },
        { emoji: "🚀", delay: "1s", position: "bottom-32 left-16" }
      ]
    },
    {
      icon: Shield,
      title: "Build Smart Contracts",
      subtitle: "Code the future",
      description: "Master Solidity programming and create secure, efficient smart contracts that power the next generation of dApps.",
      bgGradient: "from-blue-400 via-blue-500 to-blue-600",
      features: ["Solidity Programming", "Security Audits", "dApp Development"],
      stats: { value: "150k+", label: "Smart Contracts Deployed" },
      floatingElements: [
        { emoji: "⚡", delay: "0s", position: "top-16 left-12" },
        { emoji: "🔒", delay: "0.7s", position: "top-24 right-12" },
        { emoji: "💻", delay: "1.2s", position: "bottom-28 right-20" }
      ]
    },
    {
      icon: Trophy,
      title: "Land Your Dream Job",
      subtitle: "Join the revolution",
      description: "Get certified, build a portfolio, and connect with top Web3 companies hiring blockchain developers and DeFi experts.",
      bgGradient: "from-purple-400 via-purple-500 to-purple-600",
      features: ["Job Placement", "Portfolio Building", "Industry Network"],
      stats: { value: "$120k+", label: "Average Salary" },
      floatingElements: [
        { emoji: "🎯", delay: "0s", position: "top-12 right-14" },
        { emoji: "🏆", delay: "0.6s", position: "top-32 left-8" },
        { emoji: "💼", delay: "1.1s", position: "bottom-24 right-8" }
      ]
    }
  ];

  const currentStepData = onboardingSteps[currentStep];

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      if (currentStep < onboardingSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        onComplete();
      }
      setIsAnimating(false);
    }, 300);
  };

  const handleSkip = () => {
    onComplete();
  };

  useEffect(() => {
    setIsAnimating(false);
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {currentStepData.floatingElements.map((element, index) => (
          <div
            key={index}
            className={`absolute text-2xl animate-bounce ${element.position}`}
            style={{
              animationDelay: element.delay,
              animationDuration: '3s'
            }}
          >
            {element.emoji}
          </div>
        ))}
      </div>

      {/* Progress indicators */}
      <div className="relative z-10 flex justify-center space-x-3 pt-16 pb-8">
        {onboardingSteps.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-500 ${index === currentStep
                ? 'w-8 bg-gradient-to-r from-purple-500 to-blue-500'
                : index < currentStep
                  ? 'w-6 bg-emerald-500'
                  : 'w-2 bg-slate-300'
              }`}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className={`relative z-10 px-6 transition-all duration-500 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        {/* Hero Section */}
        <div className="text-center mb-8">
          {/* Icon with gradient background */}
          <div className="relative mb-6">
            <div className={`w-40 h-40 rounded-3xl bg-gradient-to-br ${currentStepData.bgGradient} mx-auto flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500`}>
              <div className="w-32 h-32 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <currentStepData.icon className="h-16 w-16 text-white" />
              </div>
            </div>

            {/* Pulse effect */}
            <div className={`absolute inset-0 w-40 h-40 rounded-3xl bg-gradient-to-br ${currentStepData.bgGradient} mx-auto animate-ping opacity-20`} />
          </div>

          {/* Title and subtitle */}
          <div className="mb-6">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">
              {currentStepData.subtitle}
            </p>
            <h1 className="text-4xl font-bold text-slate-900 mb-4 leading-tight">
              {currentStepData.title}
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-sm mx-auto">
              {currentStepData.description}
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-8">
          <div className="grid grid-cols-1 gap-3 max-w-sm mx-auto">
            {currentStepData.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-sm border border-slate-100"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentStepData.bgGradient} flex items-center justify-center`}>
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <span className="font-medium text-slate-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-white rounded-full shadow-lg border border-slate-100">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${currentStepData.bgGradient} animate-pulse`} />
            <span className="text-2xl font-bold text-slate-900">{currentStepData.stats.value}</span>
            <span className="text-sm text-slate-500">{currentStepData.stats.label}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 max-w-sm mx-auto pb-12">
          <Button
            onClick={handleNext}
            className={`w-full bg-gradient-to-r ${currentStepData.bgGradient} hover:shadow-lg text-white py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105`}
            size="lg"
          >
            {currentStep < onboardingSteps.length - 1 ? (
              <div className="flex items-center justify-center">
                <span>Continue</span>
                <ChevronRight className="ml-2 h-5 w-5" />
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Zap className="mr-2 h-5 w-5" />
                <span>Start Learning</span>
              </div>
            )}
          </Button>

          <Button
            variant="ghost"
            onClick={handleSkip}
            className="w-full text-slate-500 hover:text-slate-700 py-4 rounded-xl"
          >
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileOnboarding;
