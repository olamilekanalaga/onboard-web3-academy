
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, CheckCircle } from "lucide-react";

interface Track {
  id: string;
  title: string;
  description: string;
  modules: number;
  duration: string;
  level: string;
  progress: number;
  color: string;
  icon: any;
}

interface CourseCardProps {
  track: Track;
  isSelected: boolean;
  onClick: () => void;
}

const CourseCard = ({ track, isSelected, onClick }: CourseCardProps) => {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
        isSelected 
          ? 'border-2 border-emerald-500 shadow-lg bg-emerald-50' 
          : 'border border-slate-200 hover:border-emerald-300'
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className={`p-2 ${track.color} rounded-lg`}>
            <track.icon className="h-5 w-5 text-white" />
          </div>
          <Badge 
            variant="secondary" 
            className={`text-xs ${
              track.level === 'Beginner' ? 'bg-green-100 text-green-700' :
              track.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}
          >
            {track.level}
          </Badge>
        </div>
        <CardTitle className="text-lg text-slate-900">{track.title}</CardTitle>
        <CardDescription className="text-sm text-slate-600 line-clamp-2">
          {track.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>{track.modules} modules</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{track.duration}</span>
          </div>
        </div>

        {track.progress > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Progress</span>
              <span className="text-slate-900 font-medium">{track.progress}%</span>
            </div>
            <Progress value={track.progress} className="h-2" />
          </div>
        )}

        {track.progress === 0 && (
          <div className="text-sm text-slate-500 italic">
            Ready to start
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseCard;
