import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Star,
  Zap,
  Target,
  TrendingUp,
  Calendar,
  Award,
  Users,
  BookOpen,
  CheckCircle,
  Flame
} from "lucide-react";
import { UserProgress, Achievement, LeaderboardEntry, levelSystem } from "@/data/gamification";

interface GamificationDashboardProps {
  userProgress: UserProgress;
  achievements: Achievement[];
  leaderboard: LeaderboardEntry[];
  onAchievementClick: (achievementId: string) => void;
}

const GamificationDashboard: React.FC<GamificationDashboardProps> = ({
  userProgress,
  achievements,
  leaderboard,
  onAchievementClick
}) => {
  const currentLevel = levelSystem.getLevel(userProgress.totalXP);
  const levelTitle = levelSystem.getLevelTitle(currentLevel);
  const xpForNextLevel = levelSystem.getXPForNextLevel(userProgress.totalXP);
  const progressToNextLevel = ((userProgress.totalXP % 1000) / 1000) * 100; // Simplified calculation

  const unlockedAchievements = achievements.filter(a =>
    userProgress.achievementsUnlocked.includes(a.id)
  );

  const availableAchievements = achievements.filter(a =>
    !userProgress.achievementsUnlocked.includes(a.id)
  ).slice(0, 3); // Show next 3 available achievements

  const userRank = leaderboard.findIndex(entry => entry.userId === userProgress.userId) + 1;

  return (
    <div className="space-y-6">
      {/* Level and XP Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-6 h-6" />
              <span>Level {currentLevel}</span>
            </CardTitle>
            <CardDescription className="text-blue-100">
              {levelTitle}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Progress to Level {currentLevel + 1}</span>
                <span>{xpForNextLevel} XP needed</span>
              </div>
              <Progress value={progressToNextLevel} className="h-2 bg-blue-400" />
              <div className="text-2xl font-bold">{userProgress.totalXP.toLocaleString()} XP</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Flame className="w-6 h-6 text-orange-500" />
              <span>Learning Streak</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-3xl font-bold text-orange-500">
                {userProgress.currentStreak} days
              </div>
              <div className="text-sm text-gray-600">
                Best: {userProgress.longestStreak} days
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Last active: {userProgress.lastActiveDate.toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-emerald-500" />
              <span>Leaderboard</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-3xl font-bold text-emerald-500">
                #{userRank}
              </div>
              <div className="text-sm text-gray-600">
                Global ranking
              </div>
              <Button variant="outline" size="sm" className="w-full">
                View Full Leaderboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <Tabs defaultValue="achievements" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Unlocked Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span>Unlocked Achievements</span>
                  <Badge variant="secondary">{unlockedAchievements.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {unlockedAchievements.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <Trophy className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No achievements unlocked yet</p>
                    <p className="text-sm">Complete lessons to earn your first achievement!</p>
                  </div>
                ) : (
                  unlockedAchievements.map(achievement => (
                    <div
                      key={achievement.id}
                      className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200 cursor-pointer hover:bg-yellow-100 transition-colors"
                      onClick={() => onAchievementClick(achievement.id)}
                    >
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium">{achievement.name}</div>
                        <div className="text-sm text-gray-600">{achievement.description}</div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">+{achievement.xpReward}</span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Available Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  <span>Next Achievements</span>
                </CardTitle>
                <CardDescription>
                  Complete these goals to unlock new achievements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {availableAchievements.map(achievement => (
                  <div
                    key={achievement.id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => onAchievementClick(achievement.id)}
                  >
                    <div className="text-2xl opacity-50">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium">{achievement.name}</div>
                      <div className="text-sm text-gray-600">{achievement.description}</div>
                      <div className="text-xs text-blue-600 mt-1">
                        {achievement.requirements[0]?.description}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 opacity-50">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">+{achievement.xpReward}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <span>Learning Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Courses Completed</span>
                    <span className="font-medium">{userProgress.coursesCompleted.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chapters Completed</span>
                    <span className="font-medium">{userProgress.chaptersCompleted.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Practice Sessions</span>
                    <span className="font-medium">{userProgress.practiceSessionsCompleted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Community Contributions</span>
                    <span className="font-medium">{userProgress.communityContributions}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-purple-500" />
                  <span>Badges Earned</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userProgress.badges.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <Award className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No badges earned yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {userProgress.badges.map((badge, index) => (
                      <div key={index} className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl mb-1">🏆</div>
                        <div className="text-xs font-medium">{badge}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-emerald-500" />
                <span>Top Learners</span>
              </CardTitle>
              <CardDescription>
                See how you rank against other learners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.slice(0, 10).map((entry, index) => (
                  <div
                    key={entry.userId}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${entry.userId === userProgress.userId
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-gray-50'
                      }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index === 0 ? 'bg-yellow-500 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-500 text-white' :
                          'bg-gray-200 text-gray-700'
                      }`}>
                      {entry.rank}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{entry.username}</div>
                      <div className="text-sm text-gray-600">
                        Level {entry.level} • {entry.specializations.join(', ')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{entry.totalXP.toLocaleString()} XP</div>
                      <div className="text-sm text-gray-600">
                        +{entry.weeklyXP} this week
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span>Skill Levels</span>
              </CardTitle>
              <CardDescription>
                Your expertise in different crypto domains
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(userProgress.skillLevels).map(([skill, level]) => (
                <div key={skill} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{skill}</span>
                    <span className="text-sm text-gray-600">Level {level}/5</span>
                  </div>
                  <Progress value={(level / 5) * 100} className="h-2" />
                </div>
              ))}
              {Object.keys(userProgress.skillLevels).length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <Zap className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No skills developed yet</p>
                  <p className="text-sm">Complete courses to develop your skills!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamificationDashboard;
