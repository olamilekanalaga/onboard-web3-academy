
import { Bell, Search, TrendingUp, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "./BottomNavigation";

const MobileHome = () => {
  const recentCourses = [
    {
      title: "Web3 Foundations",
      progress: 65,
      nextLesson: "Understanding Smart Contracts",
      duration: "12 min"
    },
    {
      title: "DeFi Mastery",
      progress: 30,
      nextLesson: "Yield Farming Basics",
      duration: "18 min"
    }
  ];

  const achievements = [
    { title: "First Course Started", icon: "🎯" },
    { title: "5 Lessons Completed", icon: "📚" },
    { title: "Quiz Master", icon: "🧠" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Good morning!</h1>
            <p className="text-slate-600">Ready to continue learning?</p>
          </div>
          <Button variant="ghost" size="sm" className="p-2">
            <Bell className="h-6 w-6 text-slate-600" />
          </Button>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search courses..."
            className="w-full pl-12 pr-4 py-3 bg-slate-100 rounded-lg border-0 text-slate-900 placeholder-slate-500"
          />
        </div>
      </div>

      {/* Continue Learning */}
      <div className="px-6 py-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Continue Learning</h2>
        <div className="space-y-4">
          {recentCourses.map((course, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-900">{course.title}</h3>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {course.progress}%
                  </Badge>
                </div>
                
                <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Next: {course.nextLesson}</p>
                    <div className="flex items-center text-xs text-slate-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {course.duration}
                    </div>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="px-6 py-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Achievements</h2>
        <div className="grid grid-cols-3 gap-3">
          {achievements.map((achievement, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">{achievement.icon}</div>
                <p className="text-xs font-medium text-slate-700">{achievement.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-6 py-6">
        <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-600 to-purple-700">
          <CardContent className="p-6 text-white">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">12</div>
                <div className="text-xs text-blue-100">Courses</div>
              </div>
              <div>
                <div className="text-2xl font-bold">48h</div>
                <div className="text-xs text-blue-100">Learning Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold">85%</div>
                <div className="text-xs text-blue-100">Completion</div>
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
