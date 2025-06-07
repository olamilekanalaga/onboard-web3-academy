
import { Award, Target, TrendingUp, Calendar, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import BottomNavigation from "./BottomNavigation";

const MobileProgress = () => {
  // Real user data - no achievements until courses are completed
  const achievements: any[] = []; // No achievements yet

  const weeklyProgress = [
    { day: "Mon", hours: 0, completed: false },
    { day: "Tue", hours: 0, completed: false },
    { day: "Wed", hours: 0, completed: false },
    { day: "Thu", hours: 0, completed: false },
    { day: "Fri", hours: 0, completed: false },
    { day: "Sat", hours: 0, completed: false },
    { day: "Sun", hours: 0, completed: false }
  ];

  const learningGoals = [
    { title: "Start Foundation Course", progress: 0, target: "This week" },
    { title: "Complete First Module", progress: 0, target: "This month" },
    { title: "Build Learning Habit", progress: 0, target: "Daily goal" }
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
              <div className="text-3xl font-bold mb-2">Level 1</div>
              <div className="text-emerald-100">Beginner</div>
            </div>

            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-xl font-bold">0</div>
                <div className="text-xs text-emerald-100">XP Points</div>
              </div>
              <div>
                <div className="text-xl font-bold">0</div>
                <div className="text-xs text-emerald-100">Streak</div>
              </div>
              <div>
                <div className="text-xl font-bold">0h</div>
                <div className="text-xs text-emerald-100">Total Time</div>
              </div>
              <div>
                <div className="text-xl font-bold">0</div>
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
              <span className="text-sm text-slate-600">0.0 / 5.0 hours</span>
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

            <Progress value={0} className="h-2" />
            <p className="text-sm text-slate-600 mt-2">Start learning to track your progress</p>
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
        {achievements.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="font-medium text-slate-900 mb-2">No achievements yet</h3>
              <p className="text-sm text-slate-600">
                Start learning to unlock your first achievement!
              </p>
            </CardContent>
          </Card>
        ) : (
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
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MobileProgress;
