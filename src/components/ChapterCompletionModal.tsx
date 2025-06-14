
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  Star,
  TrendingUp,
  ArrowRight,
  BookOpen,
  Target,
  X
} from "lucide-react";

interface ChapterCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  currentChapter: {
    title: string;
    keyTakeaways: string[];
    xpReward: number;
  };
  nextChapter?: {
    title: string;
    description: string;
    estimatedTime: string;
  };
  progress: {
    completed: number;
    total: number;
    xpGained: number;
  };
  isMobile?: boolean;
}

const ChapterCompletionModal = ({
  isOpen,
  onClose,
  onContinue,
  currentChapter,
  nextChapter,
  progress,
  isMobile = false
}: ChapterCompletionModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const progressPercentage = (progress.completed / progress.total) * 100;

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setShowCelebration(true), 300);
    } else {
      setIsVisible(false);
      setShowCelebration(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 transition-transform duration-500 ease-out ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <Card className={`${isMobile ? 'mx-4 mb-4' : 'mx-8 mb-8'} rounded-t-3xl border-0 shadow-2xl bg-white`}>
          <CardHeader className="text-center pb-4 relative">
            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 p-2"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Celebration animation */}
            <div className={`transition-all duration-500 ${showCelebration ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center relative">
                <CheckCircle className="h-10 w-10 text-white" />
                
                {/* Floating particles */}
                {showCelebration && (
                  <>
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
                        style={{
                          left: `${20 + Math.random() * 60}%`,
                          top: `${20 + Math.random() * 60}%`,
                          animationDelay: `${Math.random() * 0.5}s`,
                          animationDuration: '1s'
                        }}
                      />
                    ))}
                  </>
                )}
              </div>

              <CardTitle className="text-2xl text-slate-900 mb-2">
                Chapter Complete! 🎉
              </CardTitle>
              <p className="text-slate-600 mb-4">
                {currentChapter.title}
              </p>

              {/* XP Reward */}
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-lg font-bold text-emerald-600">
                  +{currentChapter.xpReward} XP
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Progress Overview */}
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Course Progress</span>
                <span className="text-sm text-slate-600">
                  {progress.completed} of {progress.total} chapters
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2 mb-2" />
              <div className="flex items-center space-x-4 text-xs text-slate-600">
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>{Math.round(progressPercentage)}% complete</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3" />
                  <span>{progress.xpGained} total XP</span>
                </div>
              </div>
            </div>

            {/* Key Takeaways */}
            <div>
              <h4 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                <Target className="h-5 w-5 text-emerald-600 mr-2" />
                What You Learned
              </h4>
              <div className="space-y-2">
                {currentChapter.keyTakeaways.map((takeaway, index) => (
                  <div
                    key={index}
                    className={`flex items-start space-x-2 transition-all duration-300 ${
                      showCelebration ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    }`}
                    style={{ transitionDelay: `${index * 100 + 500}ms` }}
                  >
                    <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700">{takeaway}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Chapter Preview */}
            {nextChapter && (
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                  <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                  Coming Up Next
                </h4>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                  <h5 className="font-medium text-slate-900 mb-2">{nextChapter.title}</h5>
                  <p className="text-sm text-slate-600 mb-3">{nextChapter.description}</p>
                  <Badge variant="secondary" className="text-xs">
                    ⏱️ {nextChapter.estimatedTime}
                  </Badge>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <Button
                onClick={onContinue}
                className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white py-3"
                size="lg"
              >
                {nextChapter ? (
                  <div className="flex items-center justify-center">
                    <span>Continue Learning</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span>Complete Course</span>
                    <CheckCircle className="ml-2 h-5 w-5" />
                  </div>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full"
              >
                Review Chapter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ChapterCompletionModal;
