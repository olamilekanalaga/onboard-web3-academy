import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCourseProgression } from "@/hooks/useCourseProgression";
import { ArrowLeft, CheckCircle, Lock, PlayCircle, Clock, Target, Star, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { courses } from "@/data/courses";
import TradingDemo from "@/components/TradingDemo";
import CrossChainTradingDemo from "@/components/CrossChainTradingDemo";
import CourseCompletionModal from "@/components/CourseCompletionModal";

const Course = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { updateChapterProgress, getCourseProgress, courseProgression, unlockCourse } = useCourseProgression();
  const [selectedModule, setSelectedModule] = useState(0);
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [courseJustCompleted, setCourseJustCompleted] = useState(false);

  // Get completed chapters from progression system
  const courseProgress = getCourseProgress(courseId || '');
  const completedChapters = courseProgress?.completedChapters || [];

  const course = courseId ? courses[courseId] : undefined;
  const courseConfig = courseId ? courseProgression[courseId as keyof typeof courseProgression] : undefined;

  // Auto-start course on load
  useEffect(() => {
    console.log('Course useEffect triggered for courseId:', courseId);
    setCourseJustCompleted(false);
    setShowCompletionModal(false);

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

  const handleCloseCompletionModal = () => {
    setShowCompletionModal(false);
  };

  const handleStartNextCourse = async (nextCourseId: string) => {
    await unlockCourse(nextCourseId);
    navigate(`/course/${nextCourseId}`);
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

  const formatContent = (content: string) => {
    return content
      .split('\n\n')
      .map((paragraph, index) => {
        if (paragraph.trim() === '') return null;

        if (paragraph.startsWith('##')) {
          return (
            <h3 key={index} className="text-2xl font-bold text-slate-900 mt-8 mb-4">
              {paragraph.replace(/^##\s*/, '')}
            </h3>
          );
        }

        if (paragraph.startsWith('###')) {
          return (
            <h4 key={index} className="text-xl font-semibold text-slate-800 mt-6 mb-3">
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
              <ul key={index} className="space-y-3 my-6 ml-6">
                {lines.map((line, lineIndex) => (
                  <li key={lineIndex} className="flex items-start space-x-3 text-slate-700">
                    <span className="text-blue-600 font-bold mt-1.5">•</span>
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

        return (
          <p
            key={index}
            className="text-slate-700 leading-relaxed mb-6"
            dangerouslySetInnerHTML={{ __html: formattedParagraph }}
          />
        );
      })
      .filter(Boolean);
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
                        {formatContent(currentChapter.content)}
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

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t mt-8">
                    {!isChapterCompleted(selectedModule, selectedChapter) && (
                      <Button
                        onClick={markChapterComplete}
                        className="bg-green-600 hover:bg-green-700 text-white flex-1"
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
                      className="flex-1"
                    >
                      Next Chapter
                    </Button>
                  </div>
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
          onStartNextCourse={handleStartNextCourse}
        />
      )}
    </div>
  );
};

export default Course;
