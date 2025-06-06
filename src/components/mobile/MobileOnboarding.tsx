
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Target, Trophy, ChevronRight } from "lucide-react";

interface MobileOnboardingProps {
  onComplete: () => void;
}

const MobileOnboarding = ({ onComplete }: MobileOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const onboardingSteps = [
    {
      icon: BookOpen,
      title: "Learn Web3 Fundamentals",
      description: "Master blockchain, crypto, and decentralized technologies from zero to hero with expert-designed courses.",
      bgGradient: "from-blue-500 to-blue-600"
    },
    {
      icon: Target,
      title: "Achieve Your Goals",
      description: "Get job-ready skills, build real projects, and join a thriving community of Web3 professionals.",
      bgGradient: "from-emerald-500 to-emerald-600"
    },
    {
      icon: Trophy,
      title: "Build Your Future",
      description: "Earn certificates, land your dream job, and become part of the future of the internet.",
      bgGradient: "from-purple-500 to-purple-600"
    }
  ];

  const currentStepData = onboardingSteps[currentStep];

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress indicators */}
      <div className="flex justify-center space-x-2 pt-12 pb-8">
        {onboardingSteps.map((_, index) => (
          <div
            key={index}
            className={`w-8 h-1 rounded-full transition-colors duration-300 ${
              index <= currentStep ? 'bg-blue-600' : 'bg-slate-200'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${currentStepData.bgGradient} flex items-center justify-center mb-8 shadow-lg`}>
          <currentStepData.icon className="h-16 w-16 text-white" />
        </div>

        <h2 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">
          {currentStepData.title}
        </h2>

        <p className="text-lg text-slate-600 mb-12 leading-relaxed max-w-sm">
          {currentStepData.description}
        </p>
      </div>

      {/* Actions */}
      <div className="px-8 pb-12 space-y-4">
        <Button 
          onClick={handleNext}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-medium"
          size="lg"
        >
          {currentStep < onboardingSteps.length - 1 ? (
            <>
              Next
              <ChevronRight className="ml-2 h-5 w-5" />
            </>
          ) : (
            'Get Started'
          )}
        </Button>

        <Button 
          variant="ghost" 
          onClick={handleSkip}
          className="w-full text-slate-500 py-4"
        >
          Skip
        </Button>
      </div>
    </div>
  );
};

export default MobileOnboarding;
