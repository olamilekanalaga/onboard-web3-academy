import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useCourseProgression } from "@/hooks/useCourseProgression";
import { ArrowLeft, CheckCircle, Lock, PlayCircle, Clock, Target, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { courses } from "@/data/courses";
import TradingDemo from "@/components/TradingDemo";
import CrossChainTradingDemo from "@/components/CrossChainTradingDemo";
import BottomNavigation from "./BottomNavigation";
import CourseWelcomeModal from "@/components/CourseWelcomeModal";
import CourseCompletionModal from "@/components/CourseCompletionModal";

const MobileCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { updateChapterProgress, getCourseProgress, courseProgression, unlockCourse } = useCourseProgression();
  const [selectedModule, setSelectedModule] = useState(0);
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [courseJustCompleted, setCourseJustCompleted] = useState(false);

  // Get completed chapters from progression system
  const courseProgress = getCourseProgress(courseId || '');
  const completedChapters = courseProgress?.completedChapters || [];

  const course = courseId ? courses[courseId] : undefined;
  const courseConfig = courseId ? courseProgression[courseId as keyof typeof courseProgression] : undefined;

  // Check for welcome modal on course load
  useEffect(() => {
    console.log('MobileCourse useEffect triggered for courseId:', courseId);
    setCourseJustCompleted(false);
    setShowCompletionModal(false);

    if (courseId) {
      const courseProgress = getCourseProgress(courseId);
      const isFirstTime = !courseProgress || courseProgress.progressPercentage === 0;

      console.log('Mobile course progress check:', { courseProgress, isFirstTime, locationState: location.state });

      // Show welcome modal if:
      // 1. Coming from course completion (showWelcome state), OR
      // 2. First time visiting this course (no progress)
      if (location.state?.showWelcome || isFirstTime) {
        console.log('Mobile showing welcome modal');
        setShowWelcomeModal(true);
        // Clear the state to prevent showing again on refresh
        if (location.state?.showWelcome) {
          window.history.replaceState({}, document.title);
        }
      }
    }
  }, [courseId, location.state, getCourseProgress]);

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-slate-900 mb-4">Course Not Found</h1>
          <Button onClick={() => navigate("/mobile/explore")}>
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  const currentModule = course.modules[selectedModule];
  const currentChapter = currentModule?.chapters[selectedChapter];

  // Debug logging
  console.log('Mobile course render - selectedModule:', selectedModule, 'selectedChapter:', selectedChapter);
  console.log('Mobile currentModule:', currentModule);
  console.log('Mobile currentChapter:', currentChapter);

  const getChapterId = (moduleId: number, chapterId: number) => `${courseId}-${moduleId}-${chapterId}`;

  const isChapterCompleted = (moduleId: number, chapterId: number) =>
    completedChapters.includes(getChapterId(moduleId, chapterId));

  const isChapterUnlocked = (moduleId: number, chapterId: number) => {
    if (moduleId === 0 && chapterId === 0) return true;
    if (chapterId === 0) {
      if (moduleId === 0) return true;
      const prevModule = course.modules[moduleId - 1];
      const lastChapterPrevModule = prevModule.chapters.length - 1;
      return isChapterCompleted(moduleId - 1, lastChapterPrevModule);
    }
    return isChapterCompleted(moduleId, chapterId - 1);
  };

  const markChapterComplete = () => {
    const chapterId = getChapterId(selectedModule, selectedChapter);
    if (!completedChapters.includes(chapterId) && courseId) {
      const totalChapters = course.modules.reduce((sum, module) => sum + module.chapters.length, 0);
      updateChapterProgress(courseId, chapterId, totalChapters);

      // Check if course is now completed
      setTimeout(() => {
        const updatedProgress = getCourseProgress(courseId);
        if (updatedProgress && updatedProgress.progressPercentage === 100 && !courseJustCompleted) {
          setCourseJustCompleted(true);
          setShowCompletionModal(true);
        }
      }, 100);
    }
  };

  const handleStartCourse = () => {
    console.log('MobileCourse.tsx: handleStartCourse called - starting course');
    
    // Set to first module and chapter immediately
    setSelectedModule(0);
    setSelectedChapter(0);
    setShowWelcomeModal(false);
    
    console.log('Mobile course started - selectedModule: 0, selectedChapter: 0');
  };

  const handleCloseWelcomeModal = () => {
    console.log('MobileCourse: handleCloseWelcomeModal called');
    setShowWelcomeModal(false);
  };

  const handleCloseCompletionModal = () => {
    setShowCompletionModal(false);
  };

  const handleStartNextCourse = async (nextCourseId: string) => {
    // Unlock the next course first
    await unlockCourse(nextCourseId);
    
    // Navigate to the next course with welcome modal
    navigate(`/mobile/course/${nextCourseId}`, { state: { showWelcome: true } });
  };

  const totalChapters = course.modules.reduce((sum, module) => sum + module.chapters.length, 0);
  const completedCount = completedChapters.length;
  const progressPercentage = (completedCount / totalChapters) * 100;

  const getIconForCourse = (courseId: string) => {
    switch (courseId) {
      case "foundation": return "🎓";
      case "defi": return "💰";
      case "degen": return "🚀";
      case "advanced-trading": return "📈";
      case "development": return "💻";
      default: return "📚";
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "foundation": return "bg-emerald-100 text-emerald-700";
      case "beginner": return "bg-green-100 text-green-700";
      case "intermediate": return "bg-yellow-100 text-yellow-700";
      case "advanced": return "bg-orange-100 text-orange-700";
      case "expert": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // Format content for mobile
  const formatContent = (content: string) => {
    return content
      .split('\n\n')
      .map((paragraph, index) => {
        if (paragraph.trim() === '') return null;

        if (paragraph.startsWith('##')) {
          return (
            <h3 key={index} className="text-lg font-bold text-slate-900 mt-6 mb-3">
              {paragraph.replace(/^##\s*/, '')}
            </h3>
          );
        }

        if (paragraph.startsWith('###')) {
          return (
            <h4 key={index} className="text-base font-semibold text-slate-800 mt-4 mb-2">
              {paragraph.replace(/^###\s*/, '')}
            </h4>
          );
        }

        const formattedParagraph = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>');

        if (paragraph.includes('•') || paragraph.includes('-')) {
          const lines = paragraph.split('\n').filter(line => line.trim());
          const isBulletList = lines.every(line => line.trim().startsWith('•') || line.trim().startsWith('-'));

          if (isBulletList) {
            return (
              <ul key={index} className="space-y-2 my-4 ml-4">
                {lines.map((line, lineIndex) => (
                  <li key={lineIndex} className="flex items-start space-x-2 text-slate-700 text-sm">
                    <span className="text-blue-600 font-bold mt-1">•</span>
                    <span
                      className="flex-1"
                      dangerouslySetInnerHTML={{
                        __html: line.replace(/^[•-]\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
                      }}
                    />
                  </li>
                ))}
              </ul>
            );
          }
        }

        return (
          <p
            key={index}
            className="text-slate-700 text-sm leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ __html: formattedParagraph }}
          />
        );
      })
      .filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 border-b border-slate-200 sticky top-0 z-10">
        <div className="flex items-center space-x-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/mobile/explore")}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-slate-900 truncate">{course.title}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge className={`text-xs ${getDifficultyColor(course.level)}`}>
                {course.level}
              </Badge>
              <span className="text-xs text-slate-600">{course.duration}</span>
            </div>
          </div>
          <div className="text-2xl">
            {getIconForCourse(course.id)}
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Progress</span>
            <span className="text-slate-900 font-medium">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      {/* Course Content */}
      <div className="p-4">
        {/* Module Navigation */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Course Content</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-48 overflow-y-auto">
              {course.modules.map((module, moduleIndex) => (
                <div key={module.id}>
                  <div className="px-4 py-2 bg-slate-50 border-b">
                    <h4 className="font-medium text-slate-900 text-sm">{module.title}</h4>
                    <p className="text-xs text-slate-500">{module.estimatedTime}</p>
                  </div>
                  {module.chapters.map((chapter, chapterIndex) => (
                    <button
                      key={chapter.id}
                      onClick={() => {
                        setSelectedModule(moduleIndex);
                        setSelectedChapter(chapterIndex);
                      }}
                      disabled={!isChapterUnlocked(moduleIndex, chapterIndex)}
                      className={`w-full text-left p-3 border-l-4 transition-all ${selectedModule === moduleIndex && selectedChapter === chapterIndex
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-transparent hover:bg-slate-50'
                        } ${!isChapterUnlocked(moduleIndex, chapterIndex)
                          ? 'opacity-50 cursor-not-allowed'
                          : 'cursor-pointer'
                        }`}
                    >
                      <div className="flex items-center space-x-2">
                        {isChapterCompleted(moduleIndex, chapterIndex) ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : isChapterUnlocked(moduleIndex, chapterIndex) ? (
                          <PlayCircle className="h-4 w-4 text-slate-400" />
                        ) : (
                          <Lock className="h-4 w-4 text-slate-300" />
                        )}
                        <div className="flex-1">
                          <div className="font-medium text-slate-900 text-sm">{chapter.title}</div>
                          <div className="flex items-center space-x-1 text-xs text-slate-500">
                            <Clock className="h-3 w-3" />
                            <span>{chapter.duration}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chapter Content */}
        {currentChapter && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{currentChapter.title}</CardTitle>
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Clock className="h-4 w-4" />
                <span>{currentChapter.duration}</span>
                {isChapterCompleted(selectedModule, selectedChapter) && (
                  <Badge className="bg-green-100 text-green-700 ml-2">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4 mt-4">
                  <div className="prose max-w-none">
                    {formatContent(currentChapter.content)}
                  </div>

                  {/* Trading Demo Component */}
                  {(currentChapter as any).demoComponent === "TradingDemo" && (
                    <div className="mt-6">
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <h4 className="text-lg font-bold text-blue-900 mb-2">🎮 Trading Demo</h4>
                        <p className="text-blue-800 text-sm">
                          Practice trading with virtual funds - no real money at risk!
                        </p>
                      </div>
                      {(currentChapter as any).demoProps?.courseType === "degen" ? (
                        <CrossChainTradingDemo />
                      ) : (
                        <TradingDemo courseType={(currentChapter as any).demoProps?.courseType || "basic"} />
                      )}
                    </div>
                  )}

                  {/* Practical Task */}
                  {currentChapter.practicalTask && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                      <div className="flex items-start space-x-2">
                        <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-blue-900 mb-2 text-sm">
                            {currentChapter.practicalTask.title}
                          </h4>
                          <p className="text-blue-800 text-sm mb-3">
                            {currentChapter.practicalTask.description}
                          </p>
                          <div className="text-xs text-blue-600">
                            ⏱️ {currentChapter.practicalTask.estimatedTime}
                            {currentChapter.practicalTask.points && (
                              <span className="ml-3">🏆 {currentChapter.practicalTask.points} points</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="summary" className="space-y-4 mt-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2 mb-3">
                      <Star className="h-5 w-5 text-green-600 mt-0.5" />
                      <h4 className="font-semibold text-green-900 text-sm">Key Takeaways</h4>
                    </div>
                    <ul className="space-y-2">
                      {currentChapter.keyTakeaways.map((takeaway, index) => (
                        <li key={index} className="flex items-start space-x-2 text-green-800">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4 border-t mt-6">
                {!isChapterCompleted(selectedModule, selectedChapter) && (
                  <Button
                    onClick={markChapterComplete}
                    className="bg-green-600 hover:bg-green-700 text-white w-full"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Complete
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={() => {
                    if (selectedChapter < currentModule.chapters.length - 1) {
                      setSelectedChapter(selectedChapter + 1);
                    } else if (selectedModule < course.modules.length - 1) {
                      setSelectedModule(selectedModule + 1);
                      setSelectedChapter(0);
                    }
                  }}
                  disabled={
                    selectedModule === course.modules.length - 1 &&
                    selectedChapter === currentModule.chapters.length - 1
                  }
                  className="w-full"
                >
                  Next Chapter
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <BottomNavigation />

      {/* Course Welcome Modal */}
      {courseId && (
        <CourseWelcomeModal
          isOpen={showWelcomeModal}
          onClose={handleCloseWelcomeModal}
          onStartCourse={handleStartCourse}
          courseId={courseId}
        />
      )}

      {/* Course Completion Modal */}
      {courseId && courseConfig && (
        <CourseCompletionModal
          isOpen={showCompletionModal}
          onClose={handleCloseCompletionModal}
          completedCourseId={courseId}
          xpEarned={courseConfig.xpReward}
          onStartNextCourse={handleStartNextCourse}
        />
      )}
    </div>
  );
};

export default MobileCourse;
