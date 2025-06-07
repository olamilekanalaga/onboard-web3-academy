
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Clock, CheckCircle, BookOpen, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import BottomNavigation from "./BottomNavigation";
import { courses } from "@/data/courses";

const MobileCourses = () => {
  const navigate = useNavigate();
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);

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

  // Get real course data - only show the modern courses we want to feature
  const featuredCourseIds = ["foundation", "defi", "degen", "advanced-trading", "development"];
  const courseList = Object.values(courses).filter(course => featuredCourseIds.includes(course.id));

  // Simulate enrolled courses with realistic progress data
  const progressData = [35, 75, 20, 90, 55]; // Fixed progress values to ensure variety

  const enrolledCourses = courseList.map((course, index) => {
    const totalChapters = course.modules.reduce((sum, module) => sum + module.chapters.length, 0);
    const progress = progressData[index] || 25;
    const completedCount = Math.floor((progress / 100) * totalChapters);

    return {
      id: course.id,
      title: course.title,
      progress: progress,
      totalLessons: totalChapters,
      completedLessons: completedCount,
      nextLesson: course.modules[0]?.chapters[0]?.title || "Getting Started",
      duration: course.modules[0]?.chapters[0]?.duration || "15 min",
      thumbnail: getIconForCourse(course.id),
      level: course.level,
      category: course.category,
      lastAccessed: ["2 hours ago", "Yesterday", "3 days ago", "1 week ago", "2 days ago"][index] || "Recently"
    };
  });

  // Filter courses by progress status
  const inProgressCourses = enrolledCourses.filter(course => course.progress > 0 && course.progress < 100);
  const completedCourses = enrolledCourses.filter(course => course.progress >= 100);

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

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">My Courses</h1>
        <p className="text-slate-600">Continue your learning journey</p>
      </div>

      {/* In Progress */}
      <div className="px-6 py-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Continue Learning</h2>
        <div className="space-y-4">
          {inProgressCourses.map((course, index) => (
            <Card key={course.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-2xl">
                    {course.thumbnail}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-900">{course.title}</h3>
                      <Badge variant="secondary" className={`text-xs ${getDifficultyColor(course.level)}`}>
                        {course.level}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600">
                        {course.completedLessons}/{course.totalLessons} chapters
                      </span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {course.progress}%
                      </Badge>
                    </div>

                    <Progress value={course.progress} className="h-2 mb-3" />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-700 mb-1">Next: {course.nextLesson}</p>
                        <div className="flex items-center text-xs text-slate-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {course.duration}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => navigate(`/mobile/course/${course.id}`)}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Continue
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {inProgressCourses.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No courses in progress</h3>
            <p className="text-slate-600 mb-4">Start learning by exploring our courses</p>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate("/mobile/explore")}
            >
              Explore Courses
            </Button>
          </div>
        )}
      </div>

      {/* Completed Courses */}
      <div className="px-6 py-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Completed</h2>
        <div className="space-y-4">
          {completedCourses.map((course, index) => (
            <Card key={course.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-xl">
                    {course.thumbnail}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-slate-900">{course.title}</h3>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-sm text-slate-600">Completed recently</p>
                    <div className="flex items-center text-xs text-slate-500 mt-1">
                      <Target className="h-3 w-3 mr-1" />
                      {course.totalLessons} chapters completed
                    </div>
                  </div>

                  <Button variant="outline" size="sm">
                    Certificate
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {completedCourses.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No completed courses yet</h3>
            <p className="text-slate-600">Complete your first course to earn a certificate</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="px-6 py-6">
        <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-600 to-blue-600">
          <CardContent className="p-6 text-white">
            <h3 className="text-lg font-bold mb-4">Your Learning Stats</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{enrolledCourses.length}</div>
                <div className="text-xs text-purple-100">Total Courses</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{completedCourses.length}</div>
                <div className="text-xs text-purple-100">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{inProgressCourses.length}</div>
                <div className="text-xs text-purple-100">In Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MobileCourses;
