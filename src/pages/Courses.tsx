
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Users, Star, ArrowRight, Filter, Search, Coins, Target, TrendingUp, Code, BarChart3, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import { courses } from "@/data/courses";
import { useState } from "react";
import { useCourseProgression } from "@/hooks/useCourseProgression";

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const { userProgress, isCourseUnlocked, isCourseCompleted, getCourseProgress } = useCourseProgression();

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

  // Only show the modern courses we want to feature
  const featuredCourseIds = ["foundation", "defi", "degen", "advanced-trading", "development"];
  const allCourses = Object.values(courses).filter(course => featuredCourseIds.includes(course.id));

  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
    return matchesSearch && matchesLevel;
  }).sort((a, b) => a.difficulty - b.difficulty); // Sort by difficulty

  const getCourseStats = (courseId: string) => {
    const course = courses[courseId];
    const totalChapters = course.modules.reduce((acc, module) => acc + module.chapters.length, 0);
    const estimatedHours = Math.ceil(totalChapters * 0.5); // 30 min per chapter
    return { totalChapters, estimatedHours };
  };

  const getCourseProgressPercentage = (courseId: string) => {
    const progress = getCourseProgress(courseId);
    return progress ? progress.progressPercentage : 0;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">All Courses</h1>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Master Web3, crypto, and blockchain through comprehensive, structured courses designed for all skill levels.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/90 border-0"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

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

              return (
                <Card key={course.id} className={`group hover:shadow-xl transition-all duration-300 border-0 ${isUnlocked ? 'bg-white' : 'bg-gray-50 opacity-75'}`}>
                  <CardHeader className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-lg ${course.color} ${!isUnlocked ? 'opacity-50' : ''}`}>
                        {!isUnlocked ? (
                          <Lock className="h-6 w-6 text-white" />
                        ) : (
                          (() => {
                            const IconComponent = iconMap[course.icon] || BookOpen;
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
                            ${course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                              course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'}
                          `}
                        >
                          {course.level}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <CardTitle className={`text-xl transition-colors ${isUnlocked ? 'group-hover:text-emerald-600' : 'text-gray-500'}`}>
                        {course.title}
                        {!isUnlocked && <Lock className="inline-block ml-2 h-4 w-4" />}
                      </CardTitle>
                      <CardDescription className={`mt-2 ${isUnlocked ? 'text-slate-600' : 'text-gray-400'}`}>
                        {isUnlocked ? course.description : 'Complete previous courses to unlock'}
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

                    {isUnlocked ? (
                      <Link to={`/course/${course.id}`} className="block">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white group-hover:bg-emerald-700">
                          {isCompleted ? 'Review Course' : progressPercentage > 0 ? 'Continue Course' : 'Start Course'}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    ) : (
                      <Button disabled className="w-full bg-gray-300 text-gray-500 cursor-not-allowed">
                        <Lock className="mr-2 h-4 w-4" />
                        Course Locked
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
