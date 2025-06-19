import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Star,
  Zap,
  Target,
  TrendingUp,
  Users,
  Flame,
  Award,
  BookOpen,
  CheckCircle
} from "lucide-react";
import { useCourseProgression } from "@/hooks/useCourseProgression";
import BottomNavigation from "./BottomNavigation";
import MobileHeader from "./MobileHeader";

const MobileGamification = () => {
  const { userProgress } = useCourseProgression();

  // Calculate level based on XP (500 XP per level)
  const currentLevel = Math.floor(userProgress.totalXP / 500) + 1;
  const xpForCurrentLevel = (currentLevel - 1) * 500;
  const xpForNextLevel = currentLevel * 500;
  const progressToNextLevel = ((userProgress.totalXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;

  // Mock achievements data
  const achievements = [
    {
      id: 'first-course',
      title: 'First Steps',
      description: 'Complete your first course',
      icon: BookOpen,
      unlocked: userProgress.completedCourses.length > 0,
      xpReward: 100
    },
    {
      id: 'streak-7',
      title: 'Week Warrior',
      description: 'Learn for 7 days straight',
      icon: Flame,
      unlocked: false,
      xpReward: 200
    },
    {
      id: 'defi-master',
      title: 'DeFi Master',
      description: 'Complete the DeFi course',
      icon: Trophy,
      unlocked: userProgress.completedCourses.includes('defi'),
      xpReward: 300
    },
    {
      id: 'trading-pro',
      title: 'Trading Pro',
      description: 'Complete advanced trading course',
      icon: TrendingUp,
      unlocked: userProgress.completedCourses.includes('advanced-trading'),
      xpReward: 500
    }
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const nextAchievements = achievements.filter(a => !a.unlocked).slice(0, 3);

  // Mock leaderboard data
  const leaderboardPosition = Math.max(1, 100 - userProgress.totalXP / 50);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <MobileHeader title="Rewards" />

      <div className="p-4 space-y-6">
        {/* Level and XP Overview */}
        <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Level {currentLevel}</h3>
                  <p className="text-blue-100">
                    {currentLevel <= 3 ? 'Beginner' : currentLevel <= 6 ? 'Intermediate' : 'Expert'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{userProgress.totalXP}</div>
                <div className="text-blue-100 text-sm">Total XP</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to Level {currentLevel + 1}</span>
                <span>{xpForNextLevel - userProgress.totalXP} XP needed</span>
              </div>
              <Progress value={progressToNextLevel} className="h-2 bg-blue-400" />
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium">Achievements</span>
              </div>
              <div className="text-2xl font-bold">{unlockedAchievements.length}</div>
              <div className="text-xs text-gray-500">of {achievements.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-medium">Rank</span>
              </div>
              <div className="text-2xl font-bold">#{Math.floor(leaderboardPosition)}</div>
              <div className="text-xs text-gray-500">Global</div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Recent Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {unlockedAchievements.length > 0 ? (
              unlockedAchievements.slice(0, 3).map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <achievement.icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-emerald-800">{achievement.title}</h4>
                    <p className="text-sm text-emerald-600">{achievement.description}</p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700">
                    +{achievement.xpReward} XP
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Trophy className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No achievements yet</p>
                <p className="text-sm">Complete courses to earn your first achievement!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next Achievements */}
        {nextAchievements.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Next Goals</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {nextAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <achievement.icon className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-700">{achievement.title}</h4>
                    <p className="text-sm text-gray-500">{achievement.description}</p>
                  </div>
                  <Badge variant="outline">
                    +{achievement.xpReward} XP
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Course Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>Course Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Completed Courses</span>
              <span className="text-lg font-bold text-emerald-600">
                {userProgress.completedCourses.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Unlocked Courses</span>
              <span className="text-lg font-bold text-blue-600">
                {userProgress.unlockedCourses.length}
              </span>
            </div>
            
            {userProgress.completedCourses.length > 0 && (
              <div className="pt-3 border-t">
                <p className="text-sm text-gray-600 mb-2">Latest completions:</p>
                {userProgress.completedCourses.slice(-2).map((courseId) => (
                  <div key={courseId} className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="capitalize">{courseId.replace('-', ' ')}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="pt-4">
          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Trophy className="w-4 h-4 mr-2" />
            View Full Leaderboard
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MobileGamification;
