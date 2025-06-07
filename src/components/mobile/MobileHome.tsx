
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Search,
  TrendingUp,
  Clock,
  Award,
  Play,
  Zap,
  Target,
  BookOpen,
  Users,
  Star,
  ChevronRight,
  Fire,
  Trophy,
  Coins,
  ArrowRight,
  Calendar,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { courses } from "@/data/courses";
import BottomNavigation from "./BottomNavigation";

const MobileHome = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [streakCount, setStreakCount] = useState(7);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

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

  // Get featured courses with progress
  const featuredCourseIds = ["foundation", "defi", "degen"];
  const recentCourses = featuredCourseIds.map((id, index) => {
    const course = courses[id];
    const progressValues = [65, 30, 85];
    return {
      id,
      title: course?.title || "Course",
      progress: progressValues[index],
      nextLesson: course?.modules[0]?.chapters[0]?.title || "Getting Started",
      duration: course?.modules[0]?.chapters[0]?.duration || "15 min",
      icon: getIconForCourse(id),
      category: course?.category || "general"
    };
  });

  const achievements = [
    { title: "Learning Streak", icon: "🔥", value: `${streakCount} days`, color: "from-orange-500 to-red-500" },
    { title: "Courses Started", icon: "🎯", value: "5", color: "from-blue-500 to-purple-500" },
    { title: "Hours Learned", icon: "⏰", value: "24h", color: "from-emerald-500 to-teal-500" },
    { title: "Certificates", icon: "🏆", value: "2", color: "from-yellow-500 to-orange-500" }
  ];

  const quickActions = [
    { title: "Explore Courses", icon: Search, color: "bg-blue-500", route: "/mobile/explore" },
    { title: "My Progress", icon: BarChart3, color: "bg-emerald-500", route: "/mobile/progress" },
    { title: "Certificates", icon: Award, color: "bg-purple-500", route: "/mobile/profile" },
    { title: "Community", icon: Users, color: "bg-orange-500", route: "/mobile/explore" }
  ];

  const dailyGoal = {
    target: 30, // minutes
    completed: 18,
    percentage: 60
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 px-6 pt-12 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-1">{getGreeting()}! 👋</h1>
            <p className="text-blue-100">Ready to level up your Web3 skills?</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Button variant="ghost" size="sm" className="p-2 text-white hover:bg-white/10">
                <Bell className="h-6 w-6" />
              </Button>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-lg">👤</span>
            </div>
          </div>
        </div>

        {/* Daily Goal Progress */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-yellow-400" />
                <span className="font-medium">Daily Goal</span>
              </div>
              <div className="flex items-center space-x-1">
                <Fire className="h-4 w-4 text-orange-400" />
                <span className="text-sm font-medium">{streakCount} day streak</span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-100">{dailyGoal.completed} / {dailyGoal.target} minutes</span>
              <span className="text-sm font-medium">{dailyGoal.percentage}%</span>
            </div>
            <Progress value={dailyGoal.percentage} className="h-2 bg-white/20" />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
          <Button variant="ghost" size="sm" className="text-blue-600">
            <span className="text-sm">View All</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card
                key={index}
                className="border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer transform hover:scale-105"
                onClick={() => navigate(action.route)}
              >
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">{action.title}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Continue Learning */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Continue Learning</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600"
            onClick={() => navigate("/mobile/courses")}
          >
            <span className="text-sm">View All</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="space-y-4">
          {recentCourses.slice(0, 2).map((course, index) => (
            <Card
              key={index}
              className="border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => navigate(`/mobile/course/${course.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                    {course.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-900 text-sm">{course.title}</h3>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                        {course.progress}%
                      </Badge>
                    </div>

                    <Progress value={course.progress} className="h-2 mb-3" />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Next: {course.nextLesson}</p>
                        <div className="flex items-center text-xs text-slate-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {course.duration}
                        </div>
                      </div>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs px-3 py-1">
                        <Play className="h-3 w-3 mr-1" />
                        Continue
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Your Stats */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Your Stats</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600"
            onClick={() => navigate("/mobile/progress")}
          >
            <span className="text-sm">View Details</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${achievement.color} rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
                  <span className="text-xl">{achievement.icon}</span>
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">{achievement.value}</div>
                <p className="text-sm text-slate-600">{achievement.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Course */}
      <div className="px-6 py-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Featured This Week</h2>
        <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-500 to-blue-600 text-white overflow-hidden">
          <CardContent className="p-6 relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <span className="text-2xl">🚀</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">Degen Trading Masterclass</h3>
                  <p className="text-emerald-100 text-sm">Learn advanced trading strategies</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">4.9</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">2.1k students</span>
                  </div>
                </div>
                <Button
                  className="bg-white text-emerald-600 hover:bg-white/90 font-semibold"
                  onClick={() => navigate("/mobile/course/degen")}
                >
                  Start Now
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Insights */}
      <div className="px-6 py-6">
        <Card className="border-0 shadow-sm bg-slate-900 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">This Week's Progress</h3>
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-emerald-400">+25%</div>
                <div className="text-xs text-slate-400">Learning Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">3</div>
                <div className="text-xs text-slate-400">Courses Started</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">12</div>
                <div className="text-xs text-slate-400">Lessons Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MobileHome;
