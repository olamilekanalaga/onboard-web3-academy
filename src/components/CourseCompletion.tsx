
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, ArrowRight, CheckCircle, Gift } from "lucide-react";
import { useCourseProgression } from "@/hooks/useCourseProgression";
import { useNavigate } from "react-router-dom";

interface CourseCompletionProps {
  courseId: string;
  courseName: string;
  xpEarned: number;
  onUnlockNext?: () => void;
}

const CourseCompletion: React.FC<CourseCompletionProps> = ({
  courseId,
  courseName,
  xpEarned,
  onUnlockNext
}) => {
  const { userProgress, courseProgression } = useCourseProgression();
  const navigate = useNavigate();

  const currentCourse = courseProgression[courseId as keyof typeof courseProgression];
  const nextCourseIds = currentCourse?.unlocks || [];
  
  // Find which courses are now available to unlock
  const availableToUnlock = nextCourseIds.filter(nextCourseId => {
    const nextCourse = courseProgression[nextCourseId as keyof typeof courseProgression];
    return nextCourse && !userProgress.unlockedCourses.includes(nextCourseId);
  });

  const handleUnlockNext = (nextCourseId: string) => {
    if (onUnlockNext) {
      onUnlockNext();
    }
    // Navigate to the newly unlocked course
    navigate(`/course/${nextCourseId}`);
  };

  const handleViewCertificate = () => {
    // For now, just show an alert - you can implement actual certificate generation later
    alert('Certificate feature coming soon!');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Completion Celebration */}
      <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-emerald-800">
            🎉 Congratulations!
          </CardTitle>
          <p className="text-emerald-700">
            You've successfully completed <strong>{courseName}</strong>
          </p>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex justify-center items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{xpEarned}</div>
              <div className="text-sm text-emerald-600">XP Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{userProgress.currentLevel}</div>
              <div className="text-sm text-emerald-600">Current Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{userProgress.totalXP}</div>
              <div className="text-sm text-emerald-600">Total XP</div>
            </div>
          </div>

          <Button 
            onClick={handleViewCertificate}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Gift className="w-4 h-4 mr-2" />
            View Certificate
          </Button>
        </CardContent>
      </Card>

      {/* Unlock Next Courses */}
      {availableToUnlock.length > 0 && (
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-6 h-6 text-yellow-500" />
              <span>Unlock Your Next Adventure!</span>
            </CardTitle>
            <p className="text-gray-600">
              Completing this course has unlocked new learning opportunities for you.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {availableToUnlock.map(nextCourseId => {
              const nextCourse = courseProgression[nextCourseId as keyof typeof courseProgression];
              if (!nextCourse) return null;

              return (
                <div key={nextCourseId} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{nextCourse.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {nextCourse.category} • {nextCourse.estimatedTime}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {nextCourse.level}
                      </Badge>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                        +{nextCourse.xpReward} XP
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleUnlockNext(nextCourseId)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Start Course
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* No More Courses */}
      {availableToUnlock.length === 0 && (
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="text-center p-6">
            <CheckCircle className="w-16 h-16 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-purple-800 mb-2">
              Amazing Progress!
            </h3>
            <p className="text-purple-700 mb-4">
              You've completed all available courses in this learning path. 
              More advanced courses are coming soon!
            </p>
            <div className="flex justify-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/courses')}
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                Browse All Courses
              </Button>
              <Button 
                onClick={() => navigate('/profile')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                View Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CourseCompletion;
