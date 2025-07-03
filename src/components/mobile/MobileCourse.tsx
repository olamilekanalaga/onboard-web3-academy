import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCourseProgressionDB } from "@/hooks/useCourseProgressionDB";
import { useQuizProgress } from "@/hooks/useQuizProgress";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, CheckCircle, Lock, PlayCircle, Clock, Target, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { courses } from "@/data/courses";
import { getQuizForCourse } from "@/data/courseQuizzes";
import TradingDemo from "@/components/TradingDemo";
import CrossChainTradingDemo from "@/components/CrossChainTradingDemo";
import BottomNavigation from "./BottomNavigation";
import CourseCompletionModal from "@/components/CourseCompletionModal";
import CourseQuiz from "@/components/CourseQuiz";
import PWALayout from "./PWALayout";
import PWAContentWrapper from "./PWAContentWrapper";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MobileCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    updateChapterProgress,
    getCourseProgress,
    userProgress,
    courseProgression,
    getNextRecommendedCourse,
    isCourseCompleted,
    isUpdating,
    unlockCourse
  } = useCourseProgressionDB();
  const { recordQuizCompletion, hasPassedQuiz, canAccessCourse } = useQuizProgress();

  const [selectedModule, setSelectedModule] = useState(0);
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [courseJustCompleted, setCourseJustCompleted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizXP, setQuizXP] = useState(0);

  // Get completed chapters from progression system
  const courseProgress = getCourseProgress(courseId || '');
  const completedChapters = courseProgress?.completedChapters || courseProgress?.completed_chapters || [];

  console.log('Mobile Course Progress Data:', {
    courseId,
    courseProgress,
    completedChapters,
    progressPercentage: courseProgress?.progressPercentage || courseProgress?.progress_percentage
  });

  const course = courseId ? courses[courseId] : undefined;
  const courseConfig = courseId && courseProgression ? courseProgression[courseId as keyof typeof courseProgression] : undefined;

  // Debug logging
  useEffect(() => {
    console.log('Mobile Course Debug:', {
      courseId,
      courseExists: !!course,
      courseConfigExists: !!courseConfig,
      courseProgressionExists: !!courseProgression,
      availableCourses: Object.keys(courses),
      availableProgression: courseProgression ? Object.keys(courseProgression) : [],
      courseData: course ? {
        id: course.id,
        title: course.title,
        hasModules: !!course.modules,
        moduleCount: course.modules?.length || 0
      } : null,
      courseProgressionType: typeof courseProgression,
      courseProgressionKeys: courseProgression ? Object.keys(courseProgression) : 'undefined'
    });
  }, [courseId, course, courseConfig, courseProgression]);

  // Auto-start course on load
  useEffect(() => {
    setCourseJustCompleted(false);
    setShowCompletionModal(false);
    setShowQuiz(false);

    if (courseId) {
      setSelectedModule(0);
      setSelectedChapter(0);
    }
  }, [courseId]);

  // Watch for course completion to trigger quiz
  useEffect(() => {
    if (!course || !course.modules) return;

    const progressPercentage = courseProgress?.progressPercentage || courseProgress?.progress_percentage || 0;
    const totalChapters = course.modules.reduce((sum, module) => {
      return sum + (module.chapters?.length || 0);
    }, 0);
    const completedCount = completedChapters?.length || 0;

    console.log('Mobile Course Progress Check:', {
      progressPercentage,
      totalChapters,
      completedCount,
      completedChapters,
      courseJustCompleted,
      showQuiz,
      courseModules: course.modules?.length || 0
    });

    // Check if all chapters are completed OR progress is 100%
    const isFullyCompleted = (progressPercentage === 100) || (totalChapters > 0 && completedCount >= totalChapters);

    if (isFullyCompleted && !courseJustCompleted && !showQuiz) {
      console.log('🎯 Mobile Course completion detected! Showing quiz...');
      setCourseJustCompleted(true);
      setShowQuiz(true);
    }
  }, [courseProgress?.progress_percentage, completedChapters, course, courseJustCompleted, showQuiz]);

  if (!course || !courseId || !course.modules || !Array.isArray(course.modules) || course.modules.length === 0) {
    return (
      <PWALayout hasHeader={false} hasBottomNav={true} className="bg-slate-50">
        <PWAContentWrapper>
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <h1 className="text-xl font-bold text-slate-900 mb-4">Course Not Found</h1>
              <p className="text-slate-600 mb-4">
                Course ID: {courseId || 'undefined'}
              </p>
              <p className="text-slate-600 mb-4 text-sm">
                Available courses: {Object.keys(courses).join(', ')}
              </p>
              <p className="text-slate-600 mb-4 text-xs">
                Course data: {course ? 'Found' : 'Missing'},
                Modules: {course?.modules ? course.modules.length : 'None'}
              </p>
              <Button onClick={() => navigate("/mobile/explore")}>
                Back to Courses
              </Button>
            </div>
          </div>
        </PWAContentWrapper>
        <BottomNavigation />
      </PWALayout>
    );
  }

  // Ensure we have valid module and chapter indices
  const safeSelectedModule = Math.max(0, Math.min(selectedModule, course.modules.length - 1));
  const currentModule = course.modules[safeSelectedModule];

  if (!currentModule || !currentModule.chapters || !Array.isArray(currentModule.chapters) || currentModule.chapters.length === 0) {
    return (
      <PWALayout hasHeader={false} hasBottomNav={true} className="bg-slate-50">
        <PWAContentWrapper>
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <h1 className="text-xl font-bold text-slate-900 mb-4">Module Content Missing</h1>
              <p className="text-slate-600 mb-4">
                Module {safeSelectedModule + 1} has no chapters
              </p>
              <Button onClick={() => navigate("/mobile/explore")}>
                Back to Courses
              </Button>
            </div>
          </div>
        </PWAContentWrapper>
        <BottomNavigation />
      </PWALayout>
    );
  }

  const safeSelectedChapter = Math.max(0, Math.min(selectedChapter, currentModule.chapters.length - 1));
  const currentChapter = currentModule.chapters[safeSelectedChapter];

  // If no current chapter, show loading or error
  if (!currentChapter) {
    return (
      <PWALayout hasHeader={false} hasBottomNav={true} className="bg-slate-50">
        <PWAContentWrapper>
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <h1 className="text-xl font-bold text-slate-900 mb-4">Chapter Not Found</h1>
              <p className="text-slate-600 mb-4">
                Module: {safeSelectedModule + 1}, Chapter: {safeSelectedChapter + 1}
              </p>
              <Button onClick={() => navigate("/mobile/explore")}>
                Back to Courses
              </Button>
            </div>
          </div>
        </PWAContentWrapper>
        <BottomNavigation />
      </PWALayout>
    );
  }

  const getChapterId = (moduleId: number, chapterId: number) => `${courseId}-${moduleId}-${chapterId}`;

  const isChapterCompleted = (moduleId: number, chapterId: number) =>
    (completedChapters || []).includes(getChapterId(moduleId, chapterId));

  // Get next course ID based on course progression
  const getNextCourseId = (currentCourseId: string): string | null => {
    const courseOrder = [
      'foundation',
      'defi-fundamentals',
      'degen',
      'advanced-trading',
      'development',
      'nft-creation',
      'content-creation',
      'web3-security',
      'dao-governance',
      'web3-gaming',
      'crypto-tax',
      'web3-social'
    ];

    const currentIndex = courseOrder.indexOf(currentCourseId);
    if (currentIndex >= 0 && currentIndex < courseOrder.length - 1) {
      return courseOrder[currentIndex + 1];
    }
    return null;
  };

  const isChapterUnlocked = (moduleId: number, chapterId: number) => {
    if (moduleId === 0 && chapterId === 0) return true;
    if (!course?.modules || !Array.isArray(course.modules)) return false;

    if (chapterId === 0) {
      if (moduleId === 0) return true;
      const prevModule = course.modules[moduleId - 1];
      if (!prevModule || !prevModule.chapters || !Array.isArray(prevModule.chapters)) return false;
      const lastChapterPrevModule = prevModule.chapters.length - 1;
      return isChapterCompleted(moduleId - 1, lastChapterPrevModule);
    }
    return isChapterCompleted(moduleId, chapterId - 1);
  };

  const markChapterComplete = async () => {
    if (!courseId || isUpdating || !course?.modules) return;

    const chapterId = getChapterId(safeSelectedModule, safeSelectedChapter);

    if (!(completedChapters || []).includes(chapterId)) {
      const totalChapters = course.modules.reduce((sum, module) => {
        return sum + (module.chapters?.length || 0);
      }, 0);

      try {
        console.log('Marking chapter complete:', { courseId, chapterId, totalChapters });

        const result = await updateChapterProgress.mutateAsync({
          courseId,
          chapterId,
          totalChapters
        });

        console.log('Chapter completion result:', result);

        // Check if course was completed - trigger quiz instead of completion modal
        if (result?.completed && !courseJustCompleted) {
          console.log('🎉 MOBILE COURSE COMPLETED! Showing quiz now...');
          setCourseJustCompleted(true);
          setShowQuiz(true);
        }
      } catch (error) {
        console.error('Error updating chapter progress:', error);
      }
    } else {
      console.log('Chapter already completed:', chapterId);
    }
  };

  const handleCloseCompletionModal = () => {
    setShowCompletionModal(false);
  };

  const handleStartNextCourse = async (nextCourseId: string) => {
    await unlockCourse(nextCourseId);
    setShowCompletionModal(false);
    navigate(`/mobile/course/${nextCourseId}`);
  };

  const handleQuizComplete = async (passed: boolean, score: number, xpEarned: number) => {
    setQuizPassed(passed);
    setQuizScore(score);
    setQuizXP(xpEarned);

    // Record quiz completion
    if (courseId) {
      await recordQuizCompletion(courseId, score, xpEarned);
    }

    if (passed) {
      // Create social progress entry - same as desktop
      if (course && user) {
        try {
          await supabase.from('social_progress').insert({
            user_id: user.id,
            activity_type: 'course_completed',
            title: `Completed ${course.title}!`,
            description: `Just finished the ${course.title} course with a ${score}% quiz score and earned ${xpEarned} XP! 🎉`,
            course_id: courseId,
            xp_earned: xpEarned,
            user_email: user.email,
            user_name: user.user_metadata?.full_name || user.email,
            user_avatar: user.user_metadata?.avatar_url,
            is_public: true
          });

          // Create notification for course completion
          await supabase.from('notifications').insert({
            user_id: user.id,
            type: 'course_completed',
            title: 'Course Completed!',
            message: `Congratulations! You completed ${course.title} with ${score}% and earned ${xpEarned} XP!`,
            data: {
              course_id: courseId,
              course_title: course.title,
              score: score,
              xp_earned: xpEarned
            }
          });

          console.log('✅ Mobile social progress entry created');
        } catch (error) {
          console.error('Error creating mobile social progress entry:', error);
        }
      }

      // Unlock next course immediately
      if (courseId) {
        try {
          const nextCourseId = getNextCourseId(courseId);
          if (nextCourseId) {
            await unlockCourse(nextCourseId);
            console.log(`✅ Next course unlocked: ${nextCourseId}`);
          }
        } catch (error) {
          console.error('Error unlocking next course:', error);
        }
      }

      // Award XP and show completion modal
      setShowQuiz(false);
      setShowCompletionModal(true);
      console.log('🎉 Mobile Quiz passed! Course completed successfully');
    } else {
      console.log('❌ Mobile Quiz failed. Must retake course or quiz.');
    }
  };

  const totalChapters = course.modules?.reduce((sum, module) => {
    return sum + (module.chapters?.length || 0);
  }, 0) || 0;
  const completedCount = completedChapters?.length || 0;

  // Use database progress if available, otherwise calculate locally
  const dbProgress = courseProgress?.progressPercentage || courseProgress?.progress_percentage || 0;
  const localProgress = totalChapters > 0 ? (completedCount / totalChapters) * 100 : 0;
  const progressPercentage = Math.max(dbProgress, localProgress);

  console.log('Mobile Progress Display:', {
    dbProgress,
    localProgress,
    finalProgress: progressPercentage,
    completedCount,
    totalChapters
  });

  const getIconForCourse = (courseId: string) => {
    switch (courseId) {
      case "foundation": return "🎓";
      case "defi-fundamentals": return "💰";
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

  // Mobile-optimized markdown components
  const mobileMarkdownComponents = {
    h1: ({ children }: any) => (
      <h1 className="text-xl font-bold text-slate-900 mt-6 mb-4 border-b border-slate-200 pb-2">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-lg font-bold text-slate-900 mt-6 mb-3">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-base font-semibold text-slate-800 mt-4 mb-2">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-sm font-semibold text-slate-800 mt-3 mb-2">
        {children}
      </h4>
    ),
    p: ({ children }: any) => (
      <p className="text-slate-700 text-sm leading-relaxed mb-4">
        {children}
      </p>
    ),
    ul: ({ children }: any) => (
      <ul className="space-y-2 my-4 ml-4">
        {children}
      </ul>
    ),
    ol: ({ children }: any) => (
      <ol className="space-y-2 my-4 ml-4 list-decimal">
        {children}
      </ol>
    ),
    li: ({ children }: any) => (
      <li className="flex items-start space-x-2 text-slate-700 text-sm">
        <span className="text-blue-600 font-bold mt-1">•</span>
        <span className="flex-1">{children}</span>
      </li>
    ),
    strong: ({ children }: any) => (
      <strong className="font-semibold text-slate-900">{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className="italic text-slate-800">{children}</em>
    ),
    code: ({ children }: any) => (
      <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded text-xs font-mono">
        {children}
      </code>
    ),
    pre: ({ children }: any) => (
      <pre className="bg-slate-100 text-slate-800 p-3 rounded-lg overflow-x-auto my-4 text-xs">
        {children}
      </pre>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-blue-500 pl-3 my-4 italic text-slate-600 text-sm">
        {children}
      </blockquote>
    ),
  };

  return (
    <PWALayout hasHeader={false} hasBottomNav={true} className="bg-slate-50">
      <PWAContentWrapper padding="none">
        {/* Header */}
        <div className="bg-white px-4 pt-4 pb-4 border-b border-slate-200 sticky top-0 z-10">
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
              {isCourseCompleted(courseId || '') && (
                <Badge className="bg-green-100 text-green-700 text-xs">
                  Completed
                </Badge>
              )}
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
              {(course.modules || []).map((module, moduleIndex) => (
                <div key={module.id}>
                  <div className="px-4 py-2 bg-slate-50 border-b">
                    <h4 className="font-medium text-slate-900 text-sm">{module.title}</h4>
                    <p className="text-xs text-slate-500">{module.estimatedTime}</p>
                  </div>
                  {(module.chapters || []).map((chapter, chapterIndex) => (
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
                {isChapterCompleted(safeSelectedModule, safeSelectedChapter) && (
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
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={mobileMarkdownComponents}
                    >
                      {currentChapter.content}
                    </ReactMarkdown>
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
                      {(currentChapter.keyTakeaways || []).map((takeaway, index) => (
                        <li key={index} className="flex items-start space-x-2 text-green-800">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Last Chapter Notification */}
              {(() => {
                const currentModuleChapters = currentModule.chapters.length;
                const totalModules = course.modules.length;
                const isLastChapter = safeSelectedModule === totalModules - 1 &&
                                    safeSelectedChapter === currentModuleChapters - 1;

                if (isLastChapter && !isChapterCompleted(safeSelectedModule, safeSelectedChapter)) {
                  return (
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mt-4">
                      <div className="flex items-start space-x-3">
                        <div className="bg-purple-100 rounded-full p-2">
                          🎯
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-purple-900 mb-2">
                            🎉 Final Chapter!
                          </h4>
                          <p className="text-purple-800 text-sm mb-2">
                            This is the last chapter of the <strong>{course.title}</strong> course.
                            After completing this chapter, you'll take a quiz to test your knowledge.
                          </p>
                          <div className="bg-purple-100 rounded-lg p-3 mt-3">
                            <p className="text-purple-900 text-xs font-medium">
                              📝 Quiz Requirements:
                            </p>
                            <ul className="text-purple-800 text-xs mt-1 space-y-1">
                              <li>• Score 70% or higher to pass</li>
                              <li>• Unlock the next course upon passing</li>
                              <li>• Earn XP and course completion badge</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4 border-t mt-6">
                {!isChapterCompleted(safeSelectedModule, safeSelectedChapter) && (
                  <Button
                    onClick={markChapterComplete}
                    disabled={isUpdating}
                    className="bg-green-600 hover:bg-green-700 text-white w-full"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {isUpdating ? 'Saving...' : 'Mark as Complete'}
                  </Button>
                )}

                {/* Debug: Manual Quiz Button */}
                {courseProgress?.progress_percentage === 100 && !showQuiz && (
                  <Button
                    onClick={() => setShowQuiz(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                  >
                    🎯 Start Quiz (Course Complete)
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={() => {
                    const currentModuleChapters = currentModule.chapters.length;
                    const totalModules = course.modules.length;

                    if (safeSelectedChapter < currentModuleChapters - 1) {
                      setSelectedChapter(safeSelectedChapter + 1);
                    } else if (safeSelectedModule < totalModules - 1) {
                      setSelectedModule(safeSelectedModule + 1);
                      setSelectedChapter(0);
                    }
                  }}
                  disabled={
                    safeSelectedModule === course.modules.length - 1 &&
                    safeSelectedChapter === currentModule.chapters.length - 1
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

      </PWAContentWrapper>

      <BottomNavigation />

      {/* Course Quiz */}
      {showQuiz && courseId && course && (() => {
        const quizQuestions = getQuizForCourse(courseId);
        console.log('Quiz Debug:', {
          courseId,
          questionsFound: quizQuestions.length,
          questions: quizQuestions.slice(0, 2), // Show first 2 questions for debugging
          getQuizForCourse: typeof getQuizForCourse
        });

        return (
          <CourseQuiz
            courseId={courseId}
            courseName={course.title}
            questions={quizQuestions}
            onQuizComplete={handleQuizComplete}
            onRetakeCourse={() => {
              setShowQuiz(false);
              setCourseJustCompleted(false);
              setSelectedModule(0);
              setSelectedChapter(0);
            }}
            onCloseQuiz={() => setShowQuiz(false)}
            requiredScore={70}
          />
        );
      })()}

      {/* Course Completion Modal */}
      {courseId && (
        <CourseCompletionModal
          isOpen={showCompletionModal}
          onClose={handleCloseCompletionModal}
          completedCourseId={courseId}
          xpEarned={quizXP || courseConfig?.xpReward || course?.xpReward || 500}
          onStartNextCourse={handleStartNextCourse}
        />
      )}
    </PWALayout>
  );
};

export default MobileCourse;
