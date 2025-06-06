
import { Award, Target, TrendingUp, Calendar, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import BottomNavigation from "./BottomNavigation";

const MobileProgress = () => {
  const achievements = [
    { title: "First Course Completed", icon: "🎯", date: "2 weeks ago", points: 100 },
    { title: "5 Lessons in a Row", icon: "🔥", date: "1 week ago", points: 50 },
    { title: "Quiz Master", icon: "🧠", date: "3 days ago", points: 75 },
    { title: "Early Bird", icon: "🌅", date: "Yesterday", points: 25 }
  ];

  const weeklyProgress = [
    { day: "Mon", hours: 2.5, completed: true },
    { day: "Tue", hours: 1.5, completed: true },
    { day: "Wed", hours: 3.0, completed: true },
    { day: "Thu", hours: 0, completed: false },
    { day: "Fri", hours: 2.0, completed: true },
    { day: "Sat", hours: 0, completed: false },
    { day: "Sun", hours: 0, completed: false }
  ];

  const learningGoals = [
    { title: "Complete Web3 Foundations", progress: 65, target: "End of month" },
    { title: "Earn 3 Certificates", progress: 66, target: "Next quarter" },
    { title: "Study 20 hours/month", progress: 75, target: "Monthly goal" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Your Progress</h1>
        <p className="text-slate-600">Track your learning journey</p>
      </div>

      {/* Overall Stats */}
      <div className="px-6 py-6">
        <Card className="border-0 shadow-sm bg-gradient-to-r from-emerald-600 to-teal-600">
          <CardContent className="p-6 text-white">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold mb-2">Level 8</div>
              <div className="text-emerald-100">Web3 Explorer</div>
            </div>
            
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-xl font-bold">850</div>
                <div className="text-xs text-emerald-100">XP Points</div>
              </div>
              <div>
                <div className="text-xl font-bold">15</div>
                <div className="text-xs text-emerald-100">Streak</div>
              </div>
              <div>
                <div className="text-xl font-bold">48h</div>
                <div className="text-xs text-emerald-100">Total Time</div>
              </div>
              <div>
                <div className="text-xl font-bold">12</div>
                <div className="text-xs text-emerald-100">Achievements</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activity */}
      <div className="px-6 py-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">This Week</h2>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Learning Hours</span>
              <span className="text-sm text-slate-600">9.0 / 10.0 hours</span>
            </div>
            
            <div className="grid grid-cols-7 gap-2 mb-4">
              {weeklyProgress.map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-slate-600 mb-2">{day.day}</div>
                  <div className={`h-12 w-full rounded flex items-end justify-center ${day.completed ? 'bg-blue-600' : 'bg-slate-200'}`}>
                    {day.hours > 0 && (
                      <div className="text-xs text-white pb-1">{day.hours}h</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <Progress value={90} className="h-2" />
            <p className="text-sm text-slate-600 mt-2">1 hour left to reach your weekly goal</p>
          </CardContent>
        </Card>
      </div>

      {/* Learning Goals */}
      <div className="px-6 py-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Learning Goals</h2>
        <div className="space-y-4">
          {learningGoals.map((goal, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-slate-900">{goal.title}</h3>
                  <Badge variant="secondary">{goal.progress}%</Badge>
                </div>
                <Progress value={goal.progress} className="h-2 mb-2" />
                <div className="flex items-center text-sm text-slate-600">
                  <Target className="h-3 w-3 mr-1" />
                  {goal.target}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="px-6 py-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Achievements</h2>
        <div className="space-y-3">
          {achievements.map((achievement, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-xl">
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900">{achievement.title}</h3>
                    <p className="text-sm text-slate-600">{achievement.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-yellow-600">+{achievement.points}</div>
                    <div className="text-xs text-slate-500">XP</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MobileProgress;
