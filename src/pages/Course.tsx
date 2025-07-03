import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCourseProgressionDB } from "@/hooks/useCourseProgressionDB";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, CheckCircle, Lock, PlayCircle, Clock, Target, Star, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { courses } from "@/data/courses";
import TradingDemo from "@/components/TradingDemo";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CrossChainTradingDemo from "@/components/CrossChainTradingDemo";
import CourseCompletionModal from "@/components/CourseCompletionModal";
import CourseQuiz from "@/components/CourseQuiz";
import { getQuizForCourse, calculateQuizXP } from "@/data/courseQuizzes";
import { useQuizProgress } from "@/hooks/useQuizProgress";

const Course = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { updateChapterProgress, getCourseProgress, courseProgression, unlockCourse, isUpdating } = useCourseProgressionDB();
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
  const completedChapters = courseProgress?.completedChapters || [];

  // Get course data first
  const course = courseId ? courses[courseId] : undefined;
  const courseConfig = courseId ? courseProgression[courseId as keyof typeof courseProgression] : undefined;

  // Watch for course completion - Enhanced detection
  useEffect(() => {
    if (!course || !courseId) return;

    const progressPercentage = courseProgress?.progressPercentage || courseProgress?.progress_percentage || 0;
    const completedCount = completedChapters?.length || 0;

    // Calculate total chapters
    const totalChapters = course.modules?.reduce((sum, module) => {
      return sum + (module.chapters?.length || 0);
    }, 0) || 0;

    // Check completion by both percentage and chapter count
    const isCompleteByPercentage = progressPercentage >= 100;
    const isCompleteByChapters = totalChapters > 0 && completedCount >= totalChapters;
    const isCourseComplete = isCompleteByPercentage || isCompleteByChapters;

    console.log('🔍 Course Completion Check:', {
      courseId,
      progressPercentage,
      completedCount,
      totalChapters,
      isCompleteByPercentage,
      isCompleteByChapters,
      isCourseComplete,
      courseJustCompleted,
      showQuiz
    });

    if (isCourseComplete && !courseJustCompleted && !showQuiz) {
      console.log('🎯 Course completion detected! Triggering quiz...');
      setCourseJustCompleted(true);
      setShowQuiz(true);
    }
  }, [
    courseProgress?.progressPercentage,
    courseProgress?.progress_percentage,
    completedChapters?.length,
    courseJustCompleted,
    showQuiz,
    course,
    courseId
  ]);

  // Check course access permissions
  useEffect(() => {
    if (courseId && course) {
      // Define course prerequisites
      const prerequisites: { [key: string]: string[] } = {
        'foundation': [],
        'defi-fundamentals': ['foundation'],
        'degen': ['foundation', 'defi-fundamentals'],
        'advanced-trading': ['foundation', 'defi-fundamentals'],
        'development': ['foundation', 'defi-fundamentals'],
        'nft-creation': ['foundation'],
        'content-creation': ['foundation'],
        'web3-security': ['foundation', 'defi-fundamentals'],
        'dao-governance': ['foundation', 'defi-fundamentals'],
        'web3-gaming': ['foundation'],
        'crypto-tax': ['foundation', 'defi-fundamentals'],
        'web3-social': ['foundation']
      };

      const coursePrereqs = prerequisites[courseId] || [];
      const hasAccess = canAccessCourse(courseId, coursePrereqs);

      if (!hasAccess) {
        console.log('❌ Access denied to course:', courseId);
        console.log('Missing prerequisites:', coursePrereqs.filter(prereq => !hasPassedQuiz(prereq)));
        // Redirect to courses page with error message
        navigate('/courses?error=quiz_required');
      }
    }
  }, [courseId, course, canAccessCourse, hasPassedQuiz, navigate]);

  // Auto-start course on load
  useEffect(() => {
    console.log('Course useEffect triggered for courseId:', courseId);
    setCourseJustCompleted(false);
    setShowCompletionModal(false);
    setShowQuiz(false);
    setQuizPassed(false);

    if (courseId) {
      // Start with first module and chapter
      setSelectedModule(0);
      setSelectedChapter(0);
      console.log('Course auto-started - selectedModule: 0, selectedChapter: 0');
    }
  }, [courseId]);

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Course Not Found</h1>
            <Button onClick={() => navigate("/courses")}>
              Back to Courses
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentModule = course.modules[selectedModule];
  const currentChapter = currentModule?.chapters[selectedChapter];

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

  const markChapterComplete = async () => {
    const chapterId = getChapterId(selectedModule, selectedChapter);

    if (!completedChapters.includes(chapterId) && courseId) {
      // Update progress first
      const totalChapters = course.modules.reduce((sum, module) => sum + module.chapters.length, 0);

      // Calculate if this will complete the course
      const newCompletedCount = completedChapters.length + 1;
      const willCompleteCourse = newCompletedCount >= totalChapters;

      console.log(`📚 Marking chapter ${chapterId} complete`);
      console.log(`Progress: ${newCompletedCount}/${totalChapters} chapters`);
      console.log(`Will complete course: ${willCompleteCourse}`);

      // Update the progress using mutation
      updateChapterProgress.mutate(
        { courseId, chapterId, totalChapters },
        {
          onSuccess: (data) => {
            console.log('Chapter progress updated:', data);

            // If this completes the course, show quiz immediately
            if (willCompleteCourse && !courseJustCompleted) {
              console.log('🎉 COURSE COMPLETED! Showing quiz now...');
              setCourseJustCompleted(true);
              setShowQuiz(true);
            }
          },
          onError: (error) => {
            console.error('Error updating chapter progress:', error);
          }
        }
      );
    }
  };

  const handleCloseCompletionModal = () => {
    setShowCompletionModal(false);
  };

  const handleStartNextCourse = async (nextCourseId: string) => {
    await unlockCourse(nextCourseId);
    navigate(`/course/${nextCourseId}`);
  };

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

  const handleQuizComplete = async (passed: boolean, score: number, xpEarned: number) => {
    console.log('🎯 Quiz completed:', { passed, score, xpEarned, requiredScore: 70 });

    setQuizPassed(passed);
    setQuizScore(score);
    setQuizXP(xpEarned);

    // Ensure 70% minimum requirement
    const meetsRequirement = score >= 70;
    const finalPassed = passed && meetsRequirement;

    console.log('📊 Quiz validation:', {
      score,
      meetsRequirement,
      passed,
      finalPassed
    });

    // Record quiz completion
    if (courseId) {
      await recordQuizCompletion(courseId, score, xpEarned);
    }

    if (finalPassed) {
      console.log('🎉 Quiz PASSED with 70%+! Processing course completion...');

      // Unlock next course immediately
      if (courseId) {
        try {
          const nextCourseId = getNextCourseId(courseId);
          if (nextCourseId) {
            console.log(`🔓 Unlocking next course: ${nextCourseId}`);
            await unlockCourse(nextCourseId);
            console.log(`✅ Next course successfully unlocked: ${nextCourseId}`);
          } else {
            console.log('🏁 No next course - this was the final course!');
          }
        } catch (error) {
          console.error('❌ Error unlocking next course:', error);
        }
      }

      // Award XP and show completion modal
      setShowQuiz(false);
      setShowCompletionModal(true);

      console.log('🎉 Quiz passed! Course completed successfully');

      // Create progress feed entry
      if (course) {
        try {
          await supabase
            .from('social_progress')
            .insert({
              user_id: user?.id,
              activity_type: 'course_completed',
              title: `Completed ${course.title}!`,
              description: `Just finished the ${course.title} course with a ${score}% quiz score and earned ${xpEarned} XP! 🎉`,
              course_id: courseId,
              xp_earned: xpEarned
            });

          // Create notification for course completion
          await supabase
            .from('notifications')
            .insert({
              user_id: user?.id,
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
        } catch (error) {
          console.error('Error creating progress feed entry:', error);
        }
      }

      // TODO: Update user stats with XP earned
      // TODO: Update streak
      // TODO: Unlock next course
    } else {
      console.log('❌ Quiz failed. Must retake course or quiz.');
    }
    // If failed, quiz component handles retake logic
  };

  const handleRetakeCourse = () => {
    // Reset course progress and go back to first chapter
    setShowQuiz(false);
    setCourseJustCompleted(false);
    setSelectedModule(0);
    setSelectedChapter(0);
    // TODO: Reset course progress in database
    // Navigate back to the course main page, not a specific chapter
    navigate(`/course/${courseId}`);
  };

  const totalChapters = course.modules.reduce((sum, module) => sum + module.chapters.length, 0);
  const completedCount = completedChapters.length;
  const progressPercentage = (completedCount / totalChapters) * 100;

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

  // Custom components for ReactMarkdown
  const markdownComponents = {
    h1: ({ children }: any) => (
      <h1 className="text-3xl font-bold text-slate-900 mt-8 mb-6 border-b border-slate-200 pb-2">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-lg font-semibold text-slate-800 mt-4 mb-2">
        {children}
      </h4>
    ),
    p: ({ children }: any) => (
      <p className="text-slate-700 leading-relaxed my-4">
        {children}
      </p>
    ),
    ul: ({ children }: any) => (
      <ul className="space-y-2 my-4 ml-6">
        {children}
      </ul>
    ),
    ol: ({ children }: any) => (
      <ol className="space-y-2 my-4 ml-6 list-decimal">
        {children}
      </ol>
    ),
    li: ({ children }: any) => (
      <li className="flex items-start space-x-3 text-slate-700">
        <span className="text-blue-600 font-bold mt-1.5">•</span>
        <span className="flex-1 leading-relaxed">{children}</span>
      </li>
    ),
    strong: ({ children }: any) => (
      <strong className="font-semibold text-slate-900">{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className="italic text-slate-800">{children}</em>
    ),
    code: ({ children }: any) => (
      <code className="bg-slate-100 text-slate-800 px-2 py-1 rounded text-sm font-mono">
        {children}
      </code>
    ),
    pre: ({ children }: any) => (
      <pre className="bg-slate-100 text-slate-800 p-4 rounded-lg overflow-x-auto my-4">
        {children}
      </pre>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 my-4 italic text-slate-600">
        {children}
      </blockquote>
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/courses")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Courses</span>
          </Button>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl">{getIconForCourse(course.id)}</span>
              <h1 className="text-3xl font-bold text-slate-900">{course.title}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className={`${getDifficultyColor(course.level)}`}>
                {course.level}
              </Badge>
              <div className="flex items-center space-x-1 text-slate-600">
                <Clock className="h-4 w-4" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center space-x-1 text-slate-600">
                <Star className="h-4 w-4" />
                <span>{courseConfig?.xpReward} XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-600">Course Progress</span>
              <span className="text-sm font-bold text-slate-900">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <p className="text-xs text-slate-500 mt-2">
              {completedCount} of {totalChapters} chapters completed
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Course Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Course Content</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {course.modules.map((module, moduleIndex) => (
                    <div key={module.id}>
                      <div className="px-4 py-3 bg-slate-50 border-b">
                        <h4 className="font-semibold text-slate-900">{module.title}</h4>
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
                          className={`w-full text-left p-4 border-l-4 transition-all ${
                            selectedModule === moduleIndex && selectedChapter === chapterIndex
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-transparent hover:bg-slate-50'
                          } ${
                            !isChapterUnlocked(moduleIndex, chapterIndex)
                              ? 'opacity-50 cursor-not-allowed'
                              : 'cursor-pointer'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            {isChapterCompleted(moduleIndex, chapterIndex) ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : isChapterUnlocked(moduleIndex, chapterIndex) ? (
                              <PlayCircle className="h-5 w-5 text-slate-400" />
                            ) : (
                              <Lock className="h-5 w-5 text-slate-300" />
                            )}
                            <div className="flex-1">
                              <div className="font-medium text-slate-900">{chapter.title}</div>
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
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3" id="course-content">
            {currentChapter && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{currentChapter.title}</CardTitle>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1 text-slate-600">
                          <Clock className="h-4 w-4" />
                          <span>{currentChapter.duration}</span>
                        </div>
                        {isChapterCompleted(selectedModule, selectedChapter) && (
                          <Badge className="bg-green-100 text-green-700">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        )}

                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <Tabs defaultValue="content" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="content">Content</TabsTrigger>
                      <TabsTrigger value="summary">Summary</TabsTrigger>
                    </TabsList>

                    <TabsContent value="content" className="space-y-6 mt-6">
                      <div className="prose max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={markdownComponents}
                        >
                          {currentChapter.content}
                        </ReactMarkdown>
                      </div>

                      {/* Trading Demo Component */}
                      {(currentChapter as any).demoComponent === "TradingDemo" && (
                        <div className="mt-8">
                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-6">
                            <h4 className="text-xl font-bold text-blue-900 mb-3">🎮 Interactive Trading Demo</h4>
                            <p className="text-blue-800">
                              Practice trading with virtual funds - no real money at risk! This hands-on experience will help you understand the concepts better.
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
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
                          <div className="flex items-start space-x-3">
                            <Target className="h-6 w-6 text-blue-600 mt-1" />
                            <div className="flex-1">
                              <h4 className="font-bold text-blue-900 mb-3">
                                {currentChapter.practicalTask.title}
                              </h4>
                              <p className="text-blue-800 mb-4">
                                {currentChapter.practicalTask.description}
                              </p>
                              <div className="text-sm text-blue-600">
                                ⏱️ {currentChapter.practicalTask.estimatedTime}
                                {currentChapter.practicalTask.points && (
                                  <span className="ml-4">🏆 {currentChapter.practicalTask.points} points</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="summary" className="space-y-6 mt-6">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                        <div className="flex items-center space-x-2 mb-4">
                          <Star className="h-6 w-6 text-green-600" />
                          <h4 className="font-bold text-green-900 text-lg">Key Takeaways</h4>
                        </div>
                        <ul className="space-y-3">
                          {currentChapter.keyTakeaways.map((takeaway, index) => (
                            <li key={index} className="flex items-start space-x-3 text-green-800">
                              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{takeaway}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Last Chapter Notification */}
                  {(() => {
                    const currentModuleChapters = course.modules[selectedModule].chapters.length;
                    const totalModules = course.modules.length;
                    const isLastChapter = selectedModule === totalModules - 1 &&
                                        selectedChapter === currentModuleChapters - 1;

                    if (isLastChapter && !isChapterCompleted(selectedModule, selectedChapter)) {
                      return (
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 mt-6">
                          <div className="flex items-start space-x-4">
                            <div className="bg-purple-100 rounded-full p-3">
                              🎯
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-purple-900 text-xl mb-3">
                                🎉 Final Chapter!
                              </h4>
                              <p className="text-purple-800 mb-4">
                                This is the last chapter of the <strong>{course.title}</strong> course.
                                After completing this chapter, you'll take a quiz to test your knowledge and unlock the next course.
                              </p>
                              <div className="bg-purple-100 rounded-lg p-4">
                                <p className="text-purple-900 font-semibold mb-2">
                                  📝 Quiz Requirements:
                                </p>
                                <ul className="text-purple-800 space-y-1">
                                  <li>• Score 70% or higher to pass</li>
                                  <li>• Unlock the next course upon passing</li>
                                  <li>• Earn XP and course completion badge</li>
                                  <li>• Progress will be recorded in your profile</li>
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
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t mt-8">
                    {!isChapterCompleted(selectedModule, selectedChapter) && (
                      <Button
                        onClick={markChapterComplete}
                        disabled={isUpdating}
                        className="bg-green-600 hover:bg-green-700 text-white flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {isUpdating ? 'Updating...' : 'Mark as Complete'}
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
                      className="flex-1"
                    >
                      Next Chapter
                    </Button>
                  </div>

                  {/* Debug Quiz Controls */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">🧪 Debug Controls</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={() => {
                          console.log('🎯 Manual quiz trigger');
                          setShowQuiz(true);
                        }}
                        variant="outline"
                        size="sm"
                        className="bg-blue-50 hover:bg-blue-100"
                      >
                        🎯 Force Quiz
                      </Button>
                      <Button
                        onClick={() => {
                          const progressPercentage = courseProgress?.progressPercentage || courseProgress?.progress_percentage || 0;
                          const completedCount = completedChapters?.length || 0;
                          const totalChapters = course.modules?.reduce((sum, module) => sum + (module.chapters?.length || 0), 0) || 0;

                          console.log('📊 Course Status:', {
                            progressPercentage,
                            completedCount,
                            totalChapters,
                            courseJustCompleted,
                            showQuiz,
                            courseProgress
                          });
                        }}
                        variant="outline"
                        size="sm"
                        className="bg-green-50 hover:bg-green-100"
                      >
                        📊 Check Status
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Course Quiz */}
      {showQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CourseQuiz
              courseId={courseId}
              courseName={course.title}
              questions={getQuizForCourse(courseId).length > 0 ? getQuizForCourse(courseId) : [
                {
                  id: 'fallback-1',
                  question: `What was the main topic of the ${course.title} course?`,
                  type: 'multiple-choice',
                  options: [
                    'Blockchain fundamentals and cryptocurrency basics',
                    'Advanced trading strategies and market analysis',
                    'DeFi protocols and smart contracts',
                    'All of the above'
                  ],
                  correctAnswer: 3,
                  explanation: 'This course covered comprehensive Web3 education topics.',
                  difficulty: 'easy' as const,
                  points: 25,
                  category: 'Course Review'
                },
                {
                  id: 'fallback-2',
                  question: 'What is the most important rule when investing in crypto?',
                  type: 'multiple-choice',
                  options: [
                    'Always buy the dip',
                    'Only invest what you can afford to lose',
                    'Follow influencer advice',
                    'Use maximum leverage'
                  ],
                  correctAnswer: 1,
                  explanation: 'Never invest more than you can afford to lose completely.',
                  difficulty: 'easy' as const,
                  points: 25,
                  category: 'Risk Management'
                },
                {
                  id: 'fallback-3',
                  question: 'What makes this course valuable for your Web3 journey?',
                  type: 'multiple-choice',
                  options: [
                    'It provides foundational knowledge',
                    'It teaches practical skills',
                    'It prepares you for advanced topics',
                    'All of the above'
                  ],
                  correctAnswer: 3,
                  explanation: 'Great! You understand the value of structured Web3 education.',
                  difficulty: 'easy' as const,
                  points: 25,
                  category: 'Learning'
                }
              ]}
              onQuizComplete={handleQuizComplete}
              onRetakeCourse={handleRetakeCourse}
              onCloseQuiz={() => setShowQuiz(false)}
              requiredScore={70}
            />
          </div>
        </div>
      )}

      {/* Course Completion Modal */}
      {courseId && courseConfig && (
        <CourseCompletionModal
          isOpen={showCompletionModal}
          onClose={handleCloseCompletionModal}
          completedCourseId={courseId}
          xpEarned={quizPassed ? quizXP : courseConfig.xpReward}
          onStartNextCourse={handleStartNextCourse}
        />
      )}
    </div>
  );
};

export default Course;
