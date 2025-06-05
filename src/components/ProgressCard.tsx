
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, BookOpen, Award } from "lucide-react";

const ProgressCard = () => {
  const recentModules = [
    { title: "What is Web3?", completed: true, progress: 100 },
    { title: "Setting up MetaMask", completed: true, progress: 100 },
    { title: "Understanding Tokens", completed: false, progress: 60 },
    { title: "DeFi Basics", completed: false, progress: 0 },
  ];

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Your Progress</CardTitle>
          <Badge className="bg-emerald-600 text-white">
            Level 1
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-300">Web3 Foundations</span>
            <span className="text-white font-medium">25%</span>
          </div>
          <Progress value={25} className="h-3" />
          <div className="flex items-center space-x-4 text-sm text-slate-300">
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span>2 completed</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-yellow-400" />
              <span>1 in progress</span>
            </div>
          </div>
        </div>

        {/* Recent Modules */}
        <div className="space-y-3">
          <h4 className="font-medium text-white">Recent Modules</h4>
          <div className="space-y-2">
            {recentModules.map((module, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center space-x-3">
                  {module.completed ? (
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <div className="h-5 w-5 border-2 border-slate-400 rounded-full" />
                  )}
                  <span className="text-sm text-white">{module.title}</span>
                </div>
                <div className="text-sm text-slate-300">
                  {module.progress}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div className="text-center">
            <div className="text-lg font-bold text-emerald-400">2</div>
            <div className="text-xs text-slate-300">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-400">1</div>
            <div className="text-xs text-slate-300">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-400">5</div>
            <div className="text-xs text-slate-300">Remaining</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
