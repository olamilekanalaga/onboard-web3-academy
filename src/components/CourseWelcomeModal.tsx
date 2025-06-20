
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Target, Star, Clock, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { courses } from '@/data/courses';
import { useCourseProgression } from '@/hooks/useCourseProgression';

interface CourseWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCourse: () => void;
  courseId: string;
}

const CourseWelcomeModal = ({ isOpen, onClose, onStartCourse, courseId }: CourseWelcomeModalProps) => {
  const { courseProgression } = useCourseProgression();
  
  const course = courses[courseId];
  const courseConfig = courseProgression[courseId as keyof typeof courseProgression];

  if (!course || !courseConfig) {
    return null;
  }

  const handleStartCourse = () => {
    onStartCourse();
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto w-[95vw] sm:w-auto">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          </div>
          <DialogTitle className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to {course.title}!
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto px-2">
            {course.longDescription || course.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 py-2 sm:py-4 px-2 sm:px-0">
          {/* Course Overview */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3 sm:mb-4 flex items-center">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
              Course Overview
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-medium text-slate-600">Level:</span>
                  <Badge className={`text-xs ${
                    courseConfig.level === 'Foundation' ? 'bg-emerald-100 text-emerald-700' :
                    courseConfig.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                    courseConfig.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    courseConfig.level === 'Advanced' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {courseConfig.level}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-medium text-slate-600">Duration:</span>
                  <div className="flex items-center text-xs sm:text-sm text-slate-700">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    {courseConfig.estimatedTime}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-medium text-slate-600">XP Reward:</span>
                  <div className="flex items-center text-xs sm:text-sm text-slate-700">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-yellow-500" />
                    {courseConfig.xpReward} XP
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-medium text-slate-600">Modules:</span>
                  <div className="flex items-center text-xs sm:text-sm text-slate-700">
                    <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    {course.modules?.length || 0} modules
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-medium text-slate-600">Chapters:</span>
                  <div className="flex items-center text-xs sm:text-sm text-slate-700">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    {course.modules?.reduce((sum: number, module: any) => sum + module.chapters.length, 0) || 0} chapters
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-medium text-slate-600">Category:</span>
                  <span className="text-xs sm:text-sm text-slate-700 capitalize">{courseConfig.category}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Outcomes */}
          {course.learningOutcomes && course.learningOutcomes.length > 0 && (
            <div className="border border-slate-200 rounded-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4 flex items-center">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-emerald-600" />
                What You'll Learn
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {course.learningOutcomes.map((outcome: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                    <span className="text-xs sm:text-sm text-slate-700">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills You'll Gain */}
          {course.skills && course.skills.length > 0 && (
            <div className="border border-slate-200 rounded-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4 flex items-center">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-500" />
                Skills You'll Gain
              </h3>
              <div className="flex flex-wrap gap-2">
                {course.skills.map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary" className="bg-slate-100 text-slate-700 text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Prerequisites */}
          {courseConfig.prerequisites && courseConfig.prerequisites.length > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 sm:p-4">
              <h4 className="text-xs sm:text-sm font-semibold text-emerald-900 mb-2">✅ Prerequisites Completed</h4>
              <div className="flex flex-wrap gap-2">
                {courseConfig.prerequisites.map((prereqId: string) => {
                  const prereqConfig = courseProgression[prereqId as keyof typeof courseProgression];
                  return (
                    <Badge key={prereqId} className="bg-emerald-100 text-emerald-700 text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {prereqConfig?.title || prereqId}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 sm:pt-4">
            <Button 
              onClick={handleStartCourse}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm sm:text-lg py-4 sm:py-6"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Start Learning Journey
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base"
            >
              Maybe Later
            </Button>
          </div>

          {/* Motivational Message */}
          <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-slate-600">
              🚀 <strong>Ready to level up?</strong> This course will take your Web3 knowledge to the next level. 
              Let's build something amazing together!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseWelcomeModal;
