
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle, Clock, Trophy } from 'lucide-react';
import { courses } from '@/data/courses';
import { useCourseProgressionDB } from '@/hooks/useCourseProgressionDB';
import CourseCompletionModal from '@/components/CourseCompletionModal';
import BottomNavigation from './BottomNavigation';

const MobileCourseViewer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { updateChapterProgress, getCourseProgress, courseProgression } = useCourseProgressionDB();
  
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completedCourseData, setCompletedCourseData] = useState<{
    courseId: string;
    xpEarned: number;
  } | null>(null);

  const course = courseId ? courses[courseId] : null;
  const courseConfig = courseId ? courseProgression[courseId as keyof typeof courseProgression] : null;

  if (!course || !courseConfig) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Course Not Found</h2>
          <Button onClick={() => navigate('/mobile/explore')}>
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  const currentModule = course.modules[currentModuleIndex];
  const currentChapter = currentModule?.chapters[currentChapterIndex];
  const totalChapters = course.modules.reduce((sum, module) => sum + module.chapters.length, 0);
  const currentChapterNumber = course.modules
    .slice(0, currentModuleIndex)
    .reduce((sum, module) => sum + module.chapters.length, 0) + currentChapterIndex + 1;

  const progress = getCourseProgress(courseId!);

  const handleNext = async () => {
    // Mark current chapter as completed
    if (currentChapter) {
      try {
        const result = await updateChapterProgress({
          courseId: courseId!,
          chapterId: currentChapter.id,
          totalChapters
        });

        // Check if course was completed
        if (result.completed) {
          setCompletedCourseData({
            courseId: courseId!,
            xpEarned: result.xpEarned
          });
          setShowCompletionModal(true);
          return;
        }
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }

    // Navigate to next chapter
    if (currentChapterIndex < currentModule.chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
    } else if (currentModuleIndex < course.modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
      setCurrentChapterIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
    } else if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1);
      setCurrentChapterIndex(course.modules[currentModuleIndex - 1].chapters.length - 1);
    }
  };

  const isFirstChapter = currentModuleIndex === 0 && currentChapterIndex === 0;
  const isLastChapter = currentModuleIndex === course.modules.length - 1 && 
                       currentChapterIndex === currentModule.chapters.length - 1;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-3 mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/mobile/explore')}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-slate-900 truncate">{course.title}</h1>
            <p className="text-sm text-slate-600">
              Chapter {currentChapterNumber} of {totalChapters}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Progress</span>
            <span className="font-medium">{Math.round(((currentChapterNumber - 1) / totalChapters) * 100)}%</span>
          </div>
          <Progress value={((currentChapterNumber - 1) / totalChapters) * 100} className="h-2" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2 text-sm text-slate-600 mb-2">
              <BookOpen className="h-4 w-4" />
              <span>Module {currentModuleIndex + 1}: {currentModule.title}</span>
            </div>
            <CardTitle className="text-xl">{currentChapter.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose prose-slate max-w-none">
              {currentChapter.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-slate-700 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>

            {currentChapter.videoUrl && (
              <div className="bg-slate-100 rounded-lg p-6 text-center">
                <div className="text-slate-600 mb-2">Video Content</div>
                <div className="text-sm text-slate-500">
                  Video: {currentChapter.videoUrl}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-slate-200">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isFirstChapter}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>

              <Button
                onClick={handleNext}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
              >
                {isLastChapter ? (
                  <>
                    <Trophy className="h-4 w-4" />
                    <span>Complete Course</span>
                  </>
                ) : (
                  <>
                    <span>Next</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Completion Modal */}
      {showCompletionModal && completedCourseData && (
        <CourseCompletionModal
          isOpen={showCompletionModal}
          onClose={() => setShowCompletionModal(false)}
          completedCourseId={completedCourseData.courseId}
          xpEarned={completedCourseData.xpEarned}
          onStartNextCourse={(courseId) => {
            setShowCompletionModal(false);
            navigate(`/mobile/course/${courseId}`);
          }}
        />
      )}

      <BottomNavigation />
    </div>
  );
};

export default MobileCourseViewer;
