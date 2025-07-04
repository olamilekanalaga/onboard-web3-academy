
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Users, Star, ArrowRight, Filter, Search, Coins, Target, TrendingUp, Code, BarChart3, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCourseProgressionDB } from "@/hooks/useCourseProgressionDB";
import { useCourseProgression } from "@/hooks/useCourseProgression";
import { useQuizProgress } from "@/hooks/useQuizProgress";
import { courses } from "@/data/courses";

const Courses = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const { t } = useLanguage();
  const { hasPassedQuiz, canAccessCourse } = useQuizProgress();
  // Use ONLY Supabase database - no localStorage
  const { userProgress, isCourseUnlocked, isCourseCompleted, getCourseProgress, courseProgression, getNextRecommendedCourse, isLoading } = useCourseProgressionDB();

  // Set search term from URL parameter on component mount
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, [searchParams]);

  // Check for error messages
  const errorType = searchParams.get('error');
  const showQuizRequiredError = errorType === 'quiz_required';

  // Force refresh progress data when component mounts
  useEffect(() => {
    console.log('Courses page mounted, using Supabase only...');
  }, []);

  const levels = ["all", "Foundation", "Beginner", "Intermediate", "Advanced", "Expert"];

  // Icon mapping for course icons stored as strings
  const iconMap: Record<string, React.ComponentType<any>> = {
    Coins,
    Target,
    TrendingUp,
    Code,
    BarChart3,
    BookOpen, // fallback
  };

  // Convert course progression data to display format
  const allCourses = Object.values(courseProgression).map(course => ({
    id: course.id,
    title: course.title || course.id,
    description: `Learn ${course.title} and earn ${course.xpReward} XP. Master essential skills for Web3 success.`,
    level: course.level || 'Beginner',
    difficulty: course.difficulty || 1,
    color: 'bg-emerald-600', // Default color
    icon: 'Target', // Default icon
    totalXP: course.xpReward,
    modules: [{ chapters: Array(5).fill(null) }] // Mock module structure for stats
  }));

  const filteredCourses = allCourses.filter(course => {
    // Enhanced search functionality
    const searchLower = searchTerm.toLowerCase().trim();
    if (!searchLower) return selectedLevel === "all" || course.level === selectedLevel;

    const matchesSearch =
      course.title.toLowerCase().includes(searchLower) ||
      course.description.toLowerCase().includes(searchLower) ||
      course.level.toLowerCase().includes(searchLower);

    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
    return matchesSearch && matchesLevel;
  }).sort((a, b) => {
    // Sort by difficulty level, then by title
    if (a.difficulty !== b.difficulty) {
      return a.difficulty - b.difficulty;
    }
    // Add safety check for undefined titles
    const titleA = a.title || '';
    const titleB = b.title || '';
    return titleA.localeCompare(titleB);
  });

  const getCourseStats = (courseId: string) => {
    const courseData = courses[courseId];
    if (courseData && courseData.modules) {
      const totalChapters = courseData.modules.reduce((sum: number, module: any) => sum + module.chapters.length, 0);
      const estimatedHours = Math.ceil(totalChapters * 0.5); // 30 min per chapter
      return { totalChapters, estimatedHours };
    }
    // Fallback for courses without detailed module data
    const totalChapters = 5;
    const estimatedHours = Math.ceil(totalChapters * 0.5);
    return { totalChapters, estimatedHours };
  };

  const getCourseProgressPercentage = (courseId: string) => {
    const progress = getCourseProgress(courseId);
    if (!progress) return 0;

    // Debug for foundation course
    if (courseId === 'foundation') {
      console.log('Foundation progress from Supabase:', progress);
    }

    // Handle different data structures between DB and localStorage hooks
    if (typeof progress.progress_percentage === 'number') {
      // Database hook returns progress_percentage
      return progress.progress_percentage;
    } else if (typeof progress.progressPercentage === 'number') {
      // localStorage hook returns progressPercentage
      return progress.progressPercentage;
    }

    // Fallback: Calculate directly from completed chapters
    if (progress.completed_chapters && Array.isArray(progress.completed_chapters)) {
      // Database format uses completed_chapters (array)
      const totalChapters = 8; // Foundation course has 8 chapters
      return (progress.completed_chapters.length / totalChapters) * 100;
    }

    return 0;
  };

  const nextRecommendedCourse = getNextRecommendedCourse();
  const nextCourseData = nextRecommendedCourse ? courseProgression[nextRecommendedCourse as keyof typeof courseProgression] : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* Error Message */}
      {showQuizRequiredError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mx-4 mt-4 rounded-lg">
          <div className="flex items-center">
            <Lock className="h-5 w-5 mr-2" />
            <span className="font-medium">Course Access Denied</span>
          </div>
          <p className="mt-1 text-sm">
            You must complete and pass the quiz for the previous course before accessing this one.
            Each course requires a 70% score on the quiz to unlock the next course.
          </p>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">{t('courses.title')}</h1>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              {t('courses.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder={t('common.search') + '...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 bg-white border border-white/20 text-slate-900 placeholder:text-slate-500 focus:bg-white focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Next Course Recommendation */}
      {nextRecommendedCourse && nextCourseData && (
        <section className="py-8 px-4 md:px-6 bg-gradient-to-r from-emerald-50 to-blue-50 border-b">
          <div className="container mx-auto max-w-6xl">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-emerald-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Target className="w-4 h-4 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Recommended Next Course</h3>
                  </div>
                  <div className="ml-11">
                    <h4 className="font-medium text-slate-900">{nextCourseData.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Continue your learning journey • {nextCourseData.xpReward} XP • {nextCourseData.estimatedTime}
                    </p>
                  </div>
                </div>
                <Link to={`/course/${nextRecommendedCourse}`}>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    {t('courses.start_course')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="py-8 px-4 md:px-6 bg-white border-b">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-slate-600" />
              <span className="text-slate-600 font-medium">Filter by level:</span>
            </div>
            <div className="flex gap-2">
              {levels.map((level) => (
                <Button
                  key={level}
                  variant={selectedLevel === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLevel(level)}
                  className={selectedLevel === level ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                >
                  {level === "all" ? "All Levels" : level}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => {
              const stats = getCourseStats(course.id);
              const isUnlocked = isCourseUnlocked(course.id);
              const isCompleted = isCourseCompleted(course.id);
              const progressPercentage = getCourseProgressPercentage(course.id);



              // Quiz-based access control
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

              const coursePrereqs = prerequisites[course.id] || [];
              const hasQuizAccess = canAccessCourse(course.id, coursePrereqs);
              const quizPassed = hasPassedQuiz(course.id);
              // DESKTOP: Unlock all courses - remove quiz requirement for access
              const finalUnlocked = true; // All courses unlocked on desktop

              return (
                <Card key={course.id} className={`group hover:shadow-xl transition-all duration-300 border-0 ${finalUnlocked ? 'bg-white' : 'bg-gray-50 opacity-75'}`}>
                  <CardHeader className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-lg ${course.color} ${!finalUnlocked ? 'opacity-50' : ''}`}>
                        {!finalUnlocked ? (
                          <Lock className="h-6 w-6 text-white" />
                        ) : (
                          (() => {
                            const IconComponent = iconMap[course.icon] || Target;
                            return <IconComponent className="h-6 w-6 text-white" />;
                          })()
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {isCompleted && (
                          <Badge className="bg-emerald-100 text-emerald-700">
                            Completed
                          </Badge>
                        )}
                        <Badge
                          variant="secondary"
                          className={`
                            ${course.level === 'Foundation' ? 'bg-emerald-100 text-emerald-700' :
                              course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                              course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'}
                          `}
                        >
                          {course.level}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <CardTitle className={`text-xl transition-colors ${finalUnlocked ? 'group-hover:text-emerald-600' : 'text-gray-500'}`}>
                        {course.title}
                        {!finalUnlocked && <Lock className="inline-block ml-2 h-4 w-4" />}
                        {quizPassed && <span className="ml-2 text-green-600">✅</span>}
                      </CardTitle>
                      <CardDescription className={`mt-2 ${finalUnlocked ? 'text-slate-600' : 'text-gray-400'}`}>
                        {finalUnlocked ? course.description : (() => {
                          if (coursePrereqs.length > 0) {
                            const missingQuizzes = coursePrereqs.filter(prereq => !hasPassedQuiz(prereq));
                            if (missingQuizzes.length > 0) {
                              return `🎯 Pass quizzes for: ${missingQuizzes.join(', ')}`;
                            }
                          }
                          return 'Complete previous courses and pass their quizzes to unlock';
                        })()}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4" />
                        <span>{stats.totalChapters} lessons</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{stats.estimatedHours}h total</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-emerald-500" />
                        <span>{course.level}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                        <span>{course.totalXP} XP</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Your Progress</span>
                        <span className="text-slate-900 font-medium">{progressPercentage.toFixed(0)}%</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>

                    {finalUnlocked ? (
                      <Link to={`/course/${course.id}`} className="block">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white group-hover:bg-emerald-700">
                          {isCompleted ? t('courses.view_course') : progressPercentage > 0 ? t('courses.continue_course') : t('courses.start_course')}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    ) : (
                      <Button disabled className="w-full bg-gray-300 text-gray-500 cursor-not-allowed">
                        <Lock className="mr-2 h-4 w-4" />
                        {coursePrereqs.length > 0 ? t('courses.quiz_required') : t('courses.locked')}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No courses found</h3>
              <p className="text-slate-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Courses;
