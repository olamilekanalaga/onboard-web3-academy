
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Award, TrendingUp, Play, ChevronRight } from "lucide-react";
import { useFeaturedCourses } from "@/hooks/useCourses";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "./BottomNavigation";

const MobileHome = () => {
  const navigate = useNavigate();
  const { data: featuredCourses, isLoading: coursesLoading } = useFeaturedCourses();
  const { data: userProgress, isLoading: progressLoading } = useUserProgress();
  const { data: profile } = useProfile();

  const stats = [
    { 
      label: "Courses Started", 
      value: userProgress?.length || 0, 
      icon: BookOpen,
      color: "text-blue-600"
    },
    { 
      label: "Hours Learned", 
      value: Math.floor((userProgress?.reduce((acc, p) => acc + (p.progress_percentage || 0), 0) || 0) / 10), 
      icon: Clock,
      color: "text-emerald-600"
    },
    { 
      label: "Certificates", 
      value: userProgress?.filter(p => p.completed_at)?.length || 0, 
      icon: Award,
      color: "text-amber-600"
    },
    { 
      label: "Streak", 
      value: "7", 
      icon: TrendingUp,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-6 pt-12 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Welcome back, {profile?.full_name?.split(' ')[0] || 'Learner'}!
            </h1>
            <p className="text-blue-100">Ready to continue your journey?</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {profile?.full_name?.charAt(0) || 'U'}
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-3">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
              <stat.icon className="h-5 w-5 text-white mx-auto mb-1" />
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-blue-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Continue Learning */}
      {userProgress && userProgress.length > 0 && (
        <div className="px-6 py-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Continue Learning</h2>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">
                    {userProgress[0]?.courses?.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-2">
                    {userProgress[0]?.progress_percentage}% complete
                  </p>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" 
                      style={{ width: `${userProgress[0]?.progress_percentage}%` }}
                    ></div>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="ml-4"
                  onClick={() => navigate(`/mobile/course/${userProgress[0]?.course_id}`)}
                >
                  <Play className="h-4 w-4 mr-1" />
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Featured Courses */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Featured Courses</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/mobile/explore')}
          >
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {coursesLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {featuredCourses?.slice(0, 3).map((course) => (
              <Card 
                key={course.id} 
                className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/mobile/course/${course.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-1">{course.title}</h3>
                      <p className="text-sm text-slate-600 mb-2 line-clamp-2">{course.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {course.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {course.difficulty_level}
                        </Badge>
                        {course.estimated_duration && (
                          <div className="flex items-center text-xs text-slate-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {Math.floor(course.estimated_duration / 60)}h {course.estimated_duration % 60}m
                          </div>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MobileHome;
