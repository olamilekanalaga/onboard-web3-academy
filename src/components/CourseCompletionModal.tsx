import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Trophy, Star, ArrowRight, BookOpen, Target } from 'lucide-react';
import { useCourseProgression } from '@/hooks/useCourseProgression';
import { courses } from '@/data/courses';

interface CourseCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedCourseId: string;
  xpEarned: number;
  onStartNextCourse?: (courseId: string) => void;
}

const CourseCompletionModal = ({ isOpen, onClose, completedCourseId, xpEarned, onStartNextCourse }: CourseCompletionModalProps) => {
  const navigate = useNavigate();
  const { getNextRecommendedCourse, userProgress, courseProgression } = useCourseProgression();
  
  const completedCourse = courses[completedCourseId];
  const nextCourseId = getNextRecommendedCourse(completedCourseId);
  const nextCourse = nextCourseId ? courses[nextCourseId] : null;
  const nextCourseConfig = nextCourseId ? courseProgression[nextCourseId as keyof typeof courseProgression] : null;

  const handleContinueToNext = () => {
    if (nextCourseId) {
      onClose();
      // Navigate to next course and trigger welcome modal
      navigate(`/course/${nextCourseId}`, { state: { showWelcome: true } });
      // Also call the callback if provided
      if (onStartNextCourse) {
        onStartNextCourse(nextCourseId);
      }
    }
  };

  const handleBackToCourses = () => {
    navigate('/courses');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black/80 z-[9998]" style={{ zIndex: 9998 }} />
      <DialogContent className="w-[95vw] max-w-2xl sm:w-full" style={{ zIndex: 9999 }}>
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
            <Trophy className="w-8 h-8 text-emerald-600" />
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-emerald-900">
            🎉 Course Completed!
          </DialogTitle>
          <DialogDescription className="text-base sm:text-lg text-slate-600 px-4 sm:px-0">
            Congratulations! You've successfully completed <strong>{completedCourse?.title}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Achievement Summary */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 sm:p-6">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
              <div>
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-6 h-6 text-yellow-500" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-emerald-900">{xpEarned}</div>
                <div className="text-xs sm:text-sm text-emerald-700">XP Earned</div>
              </div>
              <div>
                <div className="flex items-center justify-center mb-2">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-emerald-900">{userProgress.currentLevel}</div>
                <div className="text-xs sm:text-sm text-emerald-700">Current Level</div>
              </div>
              <div>
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-emerald-900">{userProgress.completedCourses.length}</div>
                <div className="text-xs sm:text-sm text-emerald-700">Courses Completed</div>
              </div>
            </div>
          </div>

          {/* Next Course Recommendation */}
          {nextCourse && nextCourseConfig ? (
            <div className="border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-emerald-600" />
                Ready for your next challenge?
              </h3>
              
              <div className="bg-slate-50 rounded-lg p-4 mb-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-900">{nextCourse.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{nextCourse.description}</p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 ml-4">
                    {nextCourseConfig.level}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-2 text-yellow-500" />
                    <span>{nextCourseConfig.xpReward} XP</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                    <span>{nextCourseConfig.estimatedTime}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleContinueToNext}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 sm:py-2"
                >
                  Start Next Course
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  onClick={handleBackToCourses}
                  className="flex-1 py-3 sm:py-2"
                >
                  Browse All Courses
                </Button>
              </div>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                🏆 Amazing Progress!
              </h3>
              <p className="text-slate-600 mb-4">
                You've completed all available courses in this learning path. Check out other courses to continue your Web3 journey!
              </p>
              <Button 
                onClick={handleBackToCourses}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Explore More Courses
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseCompletionModal;
