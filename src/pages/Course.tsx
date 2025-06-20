import { useState, useEffect } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CheckCircle, Lock, PlayCircle, BookOpen, Clock, Target, Star, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import ChapterQA from "@/components/ChapterQA";
import TradingDemo from "@/components/TradingDemo";
import CrossChainTradingDemo from "@/components/CrossChainTradingDemo";
import CourseCompletionModal from "@/components/CourseCompletionModal";
import CourseWelcomeModal from "@/components/CourseWelcomeModal";
import { courses } from "@/data/courses";
import { useCourseProgression } from "@/hooks/useCourseProgression";

const Course = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState(0);
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [courseJustCompleted, setCourseJustCompleted] = useState(false);

  const {
    updateChapterProgress,
    courseProgression,
    getCourseProgress,
    userProgress,
    isCourseUnlocked,
    getNextRecommendedCourse
  } = useCourseProgression();
  const course = courseId ? courses[courseId] : undefined;
  const courseConfig = courseId ? courseProgression[courseId as keyof typeof courseProgression] : undefined;

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="container mx-auto max-w-4xl px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Course Not Found</h1>
          <Link to="/">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Check if course is unlocked
  if (!isCourseUnlocked(courseId || '')) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="container mx-auto max-w-4xl px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Course Locked</h1>
          <p className="text-slate-600 mb-6">
            You need to complete the prerequisite courses to unlock this course.
          </p>
          <Link to="/">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentModule = course.modules[selectedModule];
  const currentChapter = currentModule?.chapters[selectedChapter];

  // Ensure we have valid indices
  const safeSelectedModule = Math.max(0, Math.min(selectedModule, course.modules.length - 1));
  const safeSelectedChapter = Math.max(0, Math.min(selectedChapter, course.modules[safeSelectedModule]?.chapters.length - 1 || 0));
  const safeCurrentModule = course.modules[safeSelectedModule];
  const safeCurrentChapter = safeCurrentModule?.chapters[safeSelectedChapter];

  const getChapterId = (moduleId: number, chapterId: number) => `${courseId}-${moduleId}-${chapterId}`;

  const courseProgress = getCourseProgress(courseId || '');
  const completedChapters = courseProgress?.completedChapters || [];

  const isChapterCompleted = (moduleId: number, chapterId: number) =>
    completedChapters.includes(getChapterId(moduleId, chapterId));

  const isChapterUnlocked = (moduleId: number, chapterId: number) => {
    if (moduleId === 0 && chapterId === 0) return true;
    if (chapterId === 0) {
      // First chapter of module - check if previous module is completed
      if (moduleId === 0) return true;
      const prevModule = course.modules[moduleId - 1];
      const lastChapterPrevModule = prevModule.chapters.length - 1;
      return isChapterCompleted(moduleId - 1, lastChapterPrevModule);
    }
    // Check if previous chapter is completed
    return isChapterCompleted(moduleId, chapterId - 1);
  };

  const markChapterComplete = async () => {
    const chapterId = getChapterId(selectedModule, selectedChapter);
    if (!completedChapters.includes(chapterId) && courseId) {
      // Update progress in the progression system
      await updateChapterProgress(courseId, chapterId, totalChapters);

      // Force a re-render to get updated progress
      setTimeout(async () => {
        const updatedProgress = getCourseProgress(courseId);
        if (updatedProgress && updatedProgress.progressPercentage === 100 && !courseJustCompleted) {
          setCourseJustCompleted(true);
          // Show completion modal after a short delay
          setTimeout(() => {
            setShowCompletionModal(true);
          }, 500);
        }
      }, 100);
    }
  };

  const totalChapters = course.modules.reduce((sum, module) => sum + module.chapters.length, 0);
  const completedCount = completedChapters.length;
  const progressPercentage = courseProgress?.progressPercentage || 0;

  // Reset completion state when course changes and check for welcome modal
  useEffect(() => {
    setCourseJustCompleted(false);
    setShowCompletionModal(false);

    // Show welcome modal for first-time visitors or when coming from course completion
    if (courseId) {
      const courseProgress = getCourseProgress(courseId);
      const isFirstTime = !courseProgress || courseProgress.progressPercentage === 0;

      if (location.state?.showWelcome || isFirstTime) {
        setShowWelcomeModal(true);
        // Clear the state to prevent showing again on refresh
        if (location.state?.showWelcome) {
          window.history.replaceState({}, document.title);
        }
      }
    }
  }, [courseId, location.state, getCourseProgress]);

  const handleStartCourse = () => {
    setShowWelcomeModal(false);

    // Set to first module and chapter
    setSelectedModule(0);
    setSelectedChapter(0);

    // Scroll to course content
    setTimeout(() => {
      const courseContent = document.getElementById('course-content');
      if (courseContent) {
        courseContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
  };

  const handleCloseCompletionModal = () => {
    setShowCompletionModal(false);
  };

  // Function to format chapter content with proper typography and spacing
  const formatContent = (content: string) => {
    return content
      .split('\n\n')
      .map((paragraph, index) => {
        if (paragraph.trim() === '') return null;

        // Handle headers (lines starting with ##)
        if (paragraph.startsWith('##')) {
          return (
            <h3 key={index} className="text-2xl font-bold text-slate-900 mt-8 mb-4 border-b border-slate-200 pb-2">
              {paragraph.replace(/^##\s*/, '')}
            </h3>
          );
        }

        // Handle subheaders (lines starting with ###)
        if (paragraph.startsWith('###')) {
          return (
            <h4 key={index} className="text-xl font-semibold text-slate-800 mt-6 mb-3">
              {paragraph.replace(/^###\s*/, '')}
            </h4>
          );
        }

        // Handle bold text (replace **text** with proper bold)
        const formattedParagraph = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>');

        // Handle bullet points
        if (paragraph.includes('•') || paragraph.includes('-')) {
          const lines = paragraph.split('\n').filter(line => line.trim());
          const isBulletList = lines.every(line => line.trim().startsWith('•') || line.trim().startsWith('-'));

          if (isBulletList) {
            return (
              <ul key={index} className="space-y-3 my-6 ml-6">
                {lines.map((line, lineIndex) => (
                  <li key={lineIndex} className="flex items-start space-x-3 text-slate-700">
                    <span className="text-emerald-600 font-bold mt-1.5 text-lg">•</span>
                    <span
                      className="flex-1 leading-relaxed"
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

        // Regular paragraphs with better spacing
        return (
          <p
            key={index}
            className="text-slate-700 leading-relaxed mb-6 text-base"
            dangerouslySetInnerHTML={{ __html: formattedParagraph }}
          />
        );
      })
      .filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="container mx-auto max-w-7xl px-4 py-6">
        {/* Back Button and Course Header */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Link>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{course.title}</h1>
                <p className="text-slate-600 mb-4">{course.longDescription}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-slate-100 text-slate-700">{course.level}</Badge>
                  <Badge className="bg-emerald-100 text-emerald-700">{course.duration}</Badge>
                  {course.prerequisites && (
                    <Badge className="bg-yellow-100 text-yellow-700">
                      Requires: {course.prerequisites.join(", ")}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-600 mb-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-emerald-600" />
                <span>{course.modules.length} modules, {totalChapters} chapters</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>{completedCount} completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-emerald-600" />
                <span>{Math.round(progressPercentage)}% progress</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Course Progress</span>
                <span className="text-slate-900 font-medium">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div id="course-content" className="grid lg:grid-cols-4 gap-6">
          {/* Fixed Sidebar - Module and Chapter Navigation */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8">
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="text-lg">Course Content</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {course.modules.map((module, moduleIndex) => (
                      <div key={module.id}>
                        {/* Module Header */}
                        <div className="px-4 py-3 bg-slate-50 border-b">
                          <h4 className="font-medium text-slate-900 text-sm">{module.title}</h4>
                          <p className="text-xs text-slate-500">{module.estimatedTime}</p>
                        </div>

                        {/* Chapters */}
                        {module.chapters.map((chapter, chapterIndex) => (
                          <button
                            key={chapter.id}
                            onClick={() => {
                              setSelectedModule(moduleIndex);
                              setSelectedChapter(chapterIndex);
                            }}
                            disabled={!isChapterUnlocked(moduleIndex, chapterIndex)}
                            className={`w-full text-left p-3 border-l-4 transition-all ${selectedModule === moduleIndex && selectedChapter === chapterIndex
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-transparent hover:bg-slate-50'
                              } ${!isChapterUnlocked(moduleIndex, chapterIndex)
                                ? 'opacity-50 cursor-not-allowed'
                                : 'cursor-pointer'
                              }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {isChapterCompleted(moduleIndex, chapterIndex) ? (
                                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                                ) : isChapterUnlocked(moduleIndex, chapterIndex) ? (
                                  <PlayCircle className="h-4 w-4 text-slate-400" />
                                ) : (
                                  <Lock className="h-4 w-4 text-slate-300" />
                                )}
                                <div>
                                  <div className="font-medium text-slate-900 text-sm">{chapter.title}</div>
                                  <div className="flex items-center space-x-1 text-xs text-slate-500">
                                    <Clock className="h-3 w-3" />
                                    <span>{chapter.duration}</span>
                                  </div>
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
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {safeCurrentChapter ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{safeCurrentChapter.title}</CardTitle>
                      <CardDescription className="flex items-center space-x-1 mt-1">
                        <Clock className="h-4 w-4" />
                        <span>{safeCurrentChapter.duration}</span>
                      </CardDescription>
                    </div>
                    {isChapterCompleted(selectedModule, selectedChapter) && (
                      <Badge className="bg-emerald-100 text-emerald-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <Tabs defaultValue="content" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="content">Chapter Content</TabsTrigger>
                      <TabsTrigger value="summary">Key Takeaways</TabsTrigger>
                    </TabsList>

                    <TabsContent value="content" className="space-y-6 mt-6">
                      {/* Chapter Content with improved formatting and spacing */}
                      <div className="prose max-w-none">
                        <div className="space-y-1">
                          {formatContent(safeCurrentChapter.content)}
                        </div>
                      </div>

                      {/* Practical Task */}
                      {safeCurrentChapter.practicalTask && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-start space-x-2">
                            <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-blue-900 mb-2">{safeCurrentChapter.practicalTask.title}</h4>
                              <p className="text-blue-800 text-sm mb-3">{safeCurrentChapter.practicalTask.description}</p>

                              {safeCurrentChapter.practicalTask.instructions && (
                                <div className="mb-3">
                                  <h5 className="font-medium text-blue-900 text-xs mb-2">Instructions:</h5>
                                  <ol className="list-decimal list-inside space-y-1 text-xs text-blue-700">
                                    {safeCurrentChapter.practicalTask.instructions.map((instruction, index) => (
                                      <li key={index}>{instruction}</li>
                                    ))}
                                  </ol>
                                </div>
                              )}

                              <div className="flex items-center justify-between text-xs text-blue-600">
                                <span>⏱️ {safeCurrentChapter.practicalTask.estimatedTime}</span>
                                {safeCurrentChapter.practicalTask.points && (
                                  <span>🏆 {safeCurrentChapter.practicalTask.points} points</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Trading Demo Component */}
                      {(safeCurrentChapter as any).demoComponent === "TradingDemo" && (
                        <div className="mt-8">
                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-6">
                            <h4 className="text-xl font-bold text-blue-900 mb-2">🎮 Interactive Trading Demo</h4>
                            <p className="text-blue-800 mb-4">
                              Practice your trading skills with our advanced simulator. All trades are virtual - no real money at risk!
                            </p>
                          </div>
                          {(safeCurrentChapter as any).demoProps?.courseType === "degen" ? (
                            <CrossChainTradingDemo />
                          ) : (
                            <TradingDemo courseType={(safeCurrentChapter as any).demoProps?.courseType || "basic"} />
                          )}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="summary" className="space-y-6 mt-6">
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                        <div className="flex items-start space-x-2 mb-3">
                          <Star className="h-5 w-5 text-emerald-600 mt-0.5" />
                          <h4 className="font-semibold text-emerald-900">Key Takeaways</h4>
                        </div>
                        <ul className="space-y-2">
                          {safeCurrentChapter.keyTakeaways.map((takeaway, index) => (
                            <li key={index} className="flex items-start space-x-2 text-emerald-800">
                              <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{takeaway}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t mt-6">
                    {!isChapterCompleted(safeSelectedModule, safeSelectedChapter) && (
                      <Button
                        onClick={markChapterComplete}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Complete
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      onClick={() => {
                        // Navigate to next chapter logic
                        if (safeSelectedChapter < safeCurrentModule.chapters.length - 1) {
                          setSelectedChapter(safeSelectedChapter + 1);
                        } else if (safeSelectedModule < course.modules.length - 1) {
                          setSelectedModule(safeSelectedModule + 1);
                          setSelectedChapter(0);
                        }
                      }}
                      disabled={
                        safeSelectedModule === course.modules.length - 1 &&
                        safeSelectedChapter === safeCurrentModule.chapters.length - 1
                      }
                    >
                      Next Chapter
                    </Button>
                  </div>

                  {/* AI Q&A Component */}
                  <ChapterQA
                    chapterTitle={safeCurrentChapter.title}
                    courseId={course.id}
                    moduleId={safeSelectedModule}
                    chapterId={safeSelectedChapter}
                  />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No Chapter Selected</h3>
                  <p className="text-slate-600">Select a chapter from the sidebar to begin learning.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Course Completion Modal */}
      {courseId && courseConfig && (
        <CourseCompletionModal
          isOpen={showCompletionModal}
          onClose={handleCloseCompletionModal}
          completedCourseId={courseId}
          xpEarned={courseConfig.xpReward}
          onStartNextCourse={(nextCourseId) => {
            navigate(`/course/${nextCourseId}`, { state: { showWelcome: true } });
          }}
        />
      )}

      {/* Course Welcome Modal */}
      {courseId && (
        <CourseWelcomeModal
          isOpen={showWelcomeModal}
          onClose={handleCloseWelcomeModal}
          onStartCourse={handleStartCourse}
          courseId={courseId}
        />
      )}
    </div>
  );
};

export default Course;
