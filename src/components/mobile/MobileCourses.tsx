
import { Play, Clock, CheckCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import BottomNavigation from "./BottomNavigation";

const MobileCourses = () => {
  const enrolledCourses = [
    {
      title: "Web3 Foundations",
      progress: 65,
      totalLessons: 24,
      completedLessons: 16,
      nextLesson: "Understanding Smart Contracts",
      duration: "12 min",
      thumbnail: "🎓"
    },
    {
      title: "DeFi Mastery",
      progress: 30,
      totalLessons: 32,
      completedLessons: 10,
      nextLesson: "Yield Farming Basics",
      duration: "18 min",
      thumbnail: "💰"
    },
    {
      title: "Crypto Security",
      progress: 85,
      totalLessons: 18,
      completedLessons: 15,
      nextLesson: "Hardware Wallets",
      duration: "15 min",
      thumbnail: "🔒"
    }
  ];

  const completedCourses = [
    {
      title: "Bitcoin Basics",
      completedDate: "2 weeks ago",
      certificate: true,
      thumbnail: "₿"
    },
    {
      title: "Wallet Setup Guide",
      completedDate: "1 month ago",
      certificate: true,
      thumbnail: "👛"
    }
  ];

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
          {enrolledCourses.map((course, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                    {course.thumbnail}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-2">{course.title}</h3>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600">
                        {course.completedLessons}/{course.totalLessons} lessons
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
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
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
      </div>

      {/* Completed Courses */}
      <div className="px-6 py-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Completed</h2>
        <div className="space-y-4">
          {completedCourses.map((course, index) => (
            <Card key={index} className="border-0 shadow-sm">
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
                    <p className="text-sm text-slate-600">Completed {course.completedDate}</p>
                  </div>
                  
                  {course.certificate && (
                    <Button variant="outline" size="sm">
                      Certificate
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-6 py-6">
        <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-600 to-blue-600">
          <CardContent className="p-6 text-white">
            <h3 className="text-lg font-bold mb-4">Your Learning Stats</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">5</div>
                <div className="text-xs text-purple-100">Courses</div>
              </div>
              <div>
                <div className="text-2xl font-bold">32h</div>
                <div className="text-xs text-purple-100">Learned</div>
              </div>
              <div>
                <div className="text-2xl font-bold">2</div>
                <div className="text-xs text-purple-100">Certificates</div>
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
