import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCourseProgressionDB } from "@/hooks/useCourseProgressionDB";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookOpen, Clock, Star, Lock, CheckCircle, Trophy, Zap, ChevronDown, RotateCcw } from "lucide-react";
import { courses } from "@/data/courses";
import BottomNavigation from "./BottomNavigation";
import PWALayout from "./PWALayout";
import PWAContentWrapper from "./PWAContentWrapper";

const MobileCourses = () => {
  const navigate = useNavigate();
  const { 
    userProgress, 
    isCourseUnlocked, 
    isCourseCompleted, 
    getCourseProgress, 
    courseProgression
  } = useCourseProgressionDB();
  
  const [filter, setFilter] = useState<'all' | 'available' | 'completed'>('all');

  const courseList = Object.values(courses);

  const filteredCourses = courseList.filter(course => {
    switch (filter) {
      case 'available':
        return isCourseUnlocked(course.id) && !isCourseCompleted(course.id);
      case 'completed':
        return isCourseCompleted(course.id);
      default:
        return true;
    }
  });

  const getIconForCourse = (courseId: string) => {
    switch (courseId) {
      case "foundation": return "🎓";
      case "defi-fundamentals": return "💰";
      case "degen": return "🚀";
      case "advanced-trading": return "📈";
      case "development": return "💻";
      case "content-creation": return "🎨";
      case "nft-creation": return "🖼️";
      case "web3-security": return "🔒";
      case "dao-governance": return "🏛️";
      case "web3-gaming": return "🎮";
      case "crypto-tax": return "📊";
      case "web3-social": return "👥";
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

  const getCourseStatus = (courseId: string) => {
    if (isCourseCompleted(courseId)) {
      return { text: "Completed", color: "bg-green-100 text-green-700", icon: CheckCircle };
    }
    if (isCourseUnlocked(courseId)) {
      return { text: "Available", color: "bg-blue-100 text-blue-700", icon: BookOpen };
    }
    return { text: "Locked", color: "bg-gray-100 text-gray-500", icon: Lock };
  };

  const handleCourseClick = (courseId: string) => {
    if (isCourseUnlocked(courseId)) {
      navigate(`/mobile/course/${courseId}`);
    }
  };

  const handleRestartCourse = (courseId: string) => {
    // Navigate to course - the course system will handle showing from the beginning
    navigate(`/mobile/course/${courseId}`);
  };

  return (
    <PWALayout hasHeader={false} hasBottomNav={true} className="bg-slate-50">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Courses</h1>
            <p className="text-slate-600 text-sm mt-1">Continue your Web3 learning journey</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1 text-yellow-600">
              <Zap className="h-4 w-4" />
              <span className="font-bold">{userProgress.totalXP}</span>
            </div>
            <div className="text-xs text-slate-500">Level {userProgress.currentLevel}</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-lg font-bold text-slate-900">{userProgress.completedCourses.length}</div>
            <div className="text-xs text-slate-500">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-slate-900">{userProgress.unlockedCourses.length}</div>
            <div className="text-xs text-slate-500">Unlocked</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-slate-900">{Object.keys(courses).length}</div>
            <div className="text-xs text-slate-500">Total</div>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex space-x-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className="flex-1"
          >
            All Courses
          </Button>
          <Button
            variant={filter === 'available' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('available')}
            className="flex-1"
          >
            Available
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('completed')}
            className="flex-1"
          >
            Completed
          </Button>
        </div>
      </div>

      {/* Course List */}
      <div className="p-4 space-y-4">
        {filteredCourses.map((course) => {
          const progress = getCourseProgress(course.id);
          const status = getCourseStatus(course.id);
          const StatusIcon = status.icon;
          const courseConfig = courseProgression[course.id as keyof typeof courseProgression];
          const isUnlocked = isCourseUnlocked(course.id);
          const isCompleted = isCourseCompleted(course.id);

          return (
            <Card 
              key={course.id} 
              className={`transition-all ${
                isCompleted 
                  ? 'opacity-60 bg-gray-50' 
                  : isUnlocked 
                    ? 'cursor-pointer hover:shadow-md' 
                    : 'opacity-60'
              }`}
              onClick={() => !isCompleted && handleCourseClick(course.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{getIconForCourse(course.id)}</div>
                    <div className="flex-1">
                      <CardTitle className="text-base">
                        {typeof course.title === 'string' ? course.title : JSON.stringify(course.title)}
                      </CardTitle>
                      <p className="text-sm text-slate-600 mt-1">
                        {typeof course.description === 'string' ? course.description : JSON.stringify(course.description)}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${status.color} text-xs`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {status.text}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {/* Course metadata */}
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{typeof course.duration === 'string' ? course.duration : JSON.stringify(course.duration)}</span>
                    </div>
                    <Badge className={`${getDifficultyColor(course.level || 'beginner')} text-xs`}>
                      {typeof course.level === 'string' ? course.level : JSON.stringify(course.level)}
                    </Badge>
                    {courseConfig && (
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{courseConfig.xpReward} XP</span>
                      </div>
                    )}
                  </div>

                  {/* Progress bar */}
                  {progress && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Progress</span>
                        <span className="font-medium">{Math.round(progress.progress_percentage)}%</span>
                      </div>
                      <Progress value={progress.progress_percentage} className="h-2" />
                    </div>
                  )}

                  {/* Action button */}
                  <div className="pt-2">
                    {isCompleted ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full">
                            <Trophy className="h-4 w-4 mr-2" />
                            Course Options
                            <ChevronDown className="h-4 w-4 ml-2" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full">
                          <DropdownMenuItem disabled>
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            Course Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRestartCourse(course.id)}>
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Restart Course
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                        {progress?.progress_percentage ? 'Continue' : 'Start'} Course
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <BottomNavigation />
    </PWALayout>
  );
};

export default MobileCourses;
