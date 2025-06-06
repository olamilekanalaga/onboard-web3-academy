import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  Zap, 
  Trophy,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Target,
  Star,
  Flame
} from "lucide-react";

interface MobileCourseInterfaceProps {
  lesson: any;
  onComplete: () => void;
  onNext: () => void;
  onPrevious: () => void;
  progress: number;
}

const MobileCourseInterface: React.FC<MobileCourseInterfaceProps> = ({
  lesson,
  onComplete,
  onNext,
  onPrevious,
  progress
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Timer for tracking engagement
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const steps = [
    'hook',
    'keyPoints',
    'realExample',
    'actionStep',
    'quiz'
  ];

  const handleStepComplete = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      if (steps[currentStep + 1] === 'quiz' && lesson.engagement?.quickQuiz) {
        setShowQuiz(true);
      }
    } else {
      onComplete();
    }
  };

  const handleQuizAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    setTimeout(() => {
      handleStepComplete();
    }, 3000);
  };

  const renderCurrentStep = () => {
    const step = steps[currentStep];
    
    switch (step) {
      case 'hook':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Let's dive in!</h2>
            </div>
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-6">
                <p className="text-lg text-gray-800 leading-relaxed">
                  {lesson.content.hook}
                </p>
              </CardContent>
            </Card>
            <Button 
              onClick={handleStepComplete}
              className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
            >
              I'm interested! Tell me more
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        );

      case 'keyPoints':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl mb-4">💡</div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Key Insights</h2>
            </div>
            <div className="space-y-4">
              {lesson.content.keyPoints.map((point: string, index: number) => (
                <Card key={index} className="border-l-4 border-l-emerald-500">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <p className="text-gray-800 flex-1">{point}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button 
              onClick={handleStepComplete}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-3"
            >
              Got it! What's the real-world example?
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        );

      case 'realExample':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🌍</div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Real-World Example</h2>
            </div>
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <CardContent className="p-6">
                <p className="text-lg text-gray-800 leading-relaxed">
                  {lesson.content.realExample}
                </p>
              </CardContent>
            </Card>
            <Button 
              onClick={handleStepComplete}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-lg py-3"
            >
              Interesting! What can I do now?
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        );

      case 'actionStep':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Take Action Now</h2>
            </div>
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <Target className="w-6 h-6 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-purple-900 mb-2">Your Mission:</h3>
                    <p className="text-purple-800">{lesson.content.actionStep}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline"
                onClick={handleStepComplete}
                className="text-lg py-3"
              >
                I'll do it later
              </Button>
              <Button 
                onClick={handleStepComplete}
                className="bg-purple-600 hover:bg-purple-700 text-lg py-3"
              >
                Done! ✅
              </Button>
            </div>
          </div>
        );

      case 'quiz':
        if (!lesson.engagement?.quickQuiz) {
          handleStepComplete();
          return null;
        }

        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🧠</div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Knowledge Check</h2>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {lesson.engagement.quickQuiz.question}
                </h3>
                
                <div className="space-y-3">
                  {lesson.engagement.quickQuiz.options.map((option: string, index: number) => (
                    <Button
                      key={index}
                      variant={selectedAnswer === index ? "default" : "outline"}
                      onClick={() => handleQuizAnswer(index)}
                      disabled={selectedAnswer !== null}
                      className={`w-full text-left justify-start p-4 h-auto ${
                        showExplanation && index === lesson.engagement.quickQuiz.correct
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                          : showExplanation && selectedAnswer === index && index !== lesson.engagement.quickQuiz.correct
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : ''
                      }`}
                    >
                      <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </Button>
                  ))}
                </div>
                
                {showExplanation && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800">
                      <strong>Explanation:</strong> {lesson.engagement.quickQuiz.explanation}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header with Progress */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <Button variant="ghost" size="sm" onClick={onPrevious}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeSpent)}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{lesson.title}</span>
              <span>{Math.round((currentStep / steps.length) * 100)}%</span>
            </div>
            <Progress value={(currentStep / steps.length) * 100} className="h-2" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6">
        {renderCurrentStep()}
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">+{lesson.xpReward} XP</span>
            </div>
            <div className="flex items-center space-x-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">Streak: 5 days</span>
            </div>
          </div>
          
          <Button
            onClick={() => setIsActive(!isActive)}
            variant={isActive ? "default" : "outline"}
            size="sm"
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileCourseInterface;
