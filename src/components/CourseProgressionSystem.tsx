import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Lock, 
  CheckCircle, 
  Star, 
  Zap, 
  Trophy, 
  Clock,
  Target,
  AlertTriangle,
  BookOpen,
  Play
} from "lucide-react";

interface CourseProgressionProps {
  userId: string;
  currentCourse: string;
  onCourseUnlock: (courseId: string) => void;
}

interface UserProgress {
  completedCourses: string[];
  currentLevel: number;
  totalXP: number;
  unlockedCourses: string[];
  streakDays: number;
  lastActiveDate: Date;
}

const CourseProgressionSystem: React.FC<CourseProgressionProps> = ({
  userId,
  currentCourse,
  onCourseUnlock
}) => {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedCourses: [],
    currentLevel: 1,
    totalXP: 0,
    unlockedCourses: ['foundation'], // Foundation is always unlocked
    streakDays: 0,
    lastActiveDate: new Date()
  });

  const courseProgression = [
    {
      id: 'foundation',
      title: 'Crypto Foundation',
      level: 'Foundation',
      xpRequired: 0,
      xpReward: 500,
      prerequisites: [],
      unlocks: ['beginner'],
      estimatedTime: '2 weeks',
      difficulty: 1,
      description: 'Master the fundamentals of money and digital currency',
      keySkills: ['Financial Literacy', 'Blockchain Basics', 'Crypto Terminology'],
      realWorldApplication: 'Understand crypto news, make informed investment decisions',
      industryRelevance: 'Essential for any crypto career path'
    },
    {
      id: 'beginner',
      title: 'Cryptocurrency Fundamentals',
      level: 'Beginner',
      xpRequired: 500,
      xpReward: 750,
      prerequisites: ['foundation'],
      unlocks: ['intermediate'],
      estimatedTime: '2 weeks',
      difficulty: 2,
      description: 'Explore cryptocurrency types, exchanges, and basic trading',
      keySkills: ['Exchange Navigation', 'Portfolio Management', 'Risk Assessment'],
      realWorldApplication: 'Trade cryptocurrencies safely, build diversified portfolio',
      industryRelevance: 'Required for trading, investment, and DeFi participation'
    },
    {
      id: 'intermediate',
      title: 'DeFi Fundamentals',
      level: 'Intermediate',
      xpRequired: 1250,
      xpReward: 1200,
      prerequisites: ['beginner'],
      unlocks: ['advanced'],
      estimatedTime: '4 weeks',
      difficulty: 3,
      description: 'Master decentralized finance protocols and yield strategies',
      keySkills: ['DeFi Protocols', 'Yield Farming', 'Liquidity Provision'],
      realWorldApplication: 'Earn yield on crypto assets, participate in DeFi ecosystem',
      industryRelevance: 'Core skill for DeFi analysts, protocol developers'
    },
    {
      id: 'advanced',
      title: 'Smart Contract Development',
      level: 'Advanced',
      xpRequired: 2450,
      xpReward: 1500,
      prerequisites: ['intermediate'],
      unlocks: ['expert'],
      estimatedTime: '4 weeks',
      difficulty: 4,
      description: 'Build decentralized applications and smart contracts',
      keySkills: ['Solidity Programming', 'dApp Development', 'Web3 Integration'],
      realWorldApplication: 'Build and deploy your own DeFi protocols and NFT projects',
      industryRelevance: 'High-demand skill for blockchain developers (avg. $150k+ salary)'
    },
    {
      id: 'expert',
      title: 'Advanced Trading & Security',
      level: 'Expert',
      xpRequired: 3950,
      xpReward: 2000,
      prerequisites: ['advanced'],
      unlocks: [],
      estimatedTime: '4 weeks',
      difficulty: 5,
      description: 'Master institutional-level trading and security practices',
      keySkills: ['Advanced Trading', 'Security Auditing', 'Risk Management'],
      realWorldApplication: 'Professional trading, security consulting, institutional DeFi',
      industryRelevance: 'Expert-level skills for senior roles and consulting'
    }
  ];

  const isCourseUnlocked = (courseId: string): boolean => {
    return userProgress.unlockedCourses.includes(courseId);
  };

  const isCourseCompleted = (courseId: string): boolean => {
    return userProgress.completedCourses.includes(courseId);
  };

  const getNextUnlockableXP = (): number => {
    const nextCourse = courseProgression.find(course => 
      !isCourseUnlocked(course.id) && 
      course.prerequisites.every(prereq => isCourseCompleted(prereq))
    );
    return nextCourse ? nextCourse.xpRequired - userProgress.totalXP : 0;
  };

  const getCurrentLevelProgress = (): { current: number; next: number; percentage: number } => {
    const levelThresholds = [0, 500, 1250, 2450, 3950, 5950];
    const currentLevel = userProgress.currentLevel;
    const current = levelThresholds[currentLevel - 1] || 0;
    const next = levelThresholds[currentLevel] || levelThresholds[levelThresholds.length - 1];
    const percentage = ((userProgress.totalXP - current) / (next - current)) * 100;
    
    return { current, next, percentage: Math.min(percentage, 100) };
  };

  const levelProgress = getCurrentLevelProgress();

  return (
    <div className="space-y-6">
      {/* User Progress Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span>Your Learning Journey</span>
          </CardTitle>
          <CardDescription>
            Track your progress through our comprehensive crypto education pathway
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{userProgress.totalXP}</div>
              <div className="text-sm text-gray-600">Total XP Earned</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">Level {userProgress.currentLevel}</div>
              <div className="text-sm text-gray-600">Current Level</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{userProgress.streakDays}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Level Progress</span>
              <span>{Math.round(levelProgress.percentage)}%</span>
            </div>
            <Progress value={levelProgress.percentage} className="h-2" />
            <div className="text-xs text-gray-600">
              {levelProgress.next - userProgress.totalXP} XP to next level
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Progression Path */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900">Learning Pathway</h3>
        
        {courseProgression.map((course, index) => {
          const isUnlocked = isCourseUnlocked(course.id);
          const isCompleted = isCourseCompleted(course.id);
          const canUnlock = !isUnlocked && course.prerequisites.every(prereq => isCourseCompleted(prereq)) && userProgress.totalXP >= course.xpRequired;
          
          return (
            <Card key={course.id} className={`transition-all duration-300 ${
              isCompleted ? 'bg-emerald-50 border-emerald-200' :
              isUnlocked ? 'bg-blue-50 border-blue-200' :
              canUnlock ? 'bg-yellow-50 border-yellow-200' :
              'bg-gray-50 border-gray-200 opacity-60'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-emerald-500' :
                        isUnlocked ? 'bg-blue-500' :
                        canUnlock ? 'bg-yellow-500' :
                        'bg-gray-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : isUnlocked ? (
                          <Play className="w-6 h-6 text-white" />
                        ) : canUnlock ? (
                          <Star className="w-6 h-6 text-white" />
                        ) : (
                          <Lock className="w-6 h-6 text-white" />
                        )}
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{course.title}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{course.level}</Badge>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  i < course.difficulty ? 'bg-orange-400' : 'bg-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{course.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-gray-900 mb-1">Key Skills:</div>
                        <div className="text-gray-600">{course.keySkills.join(', ')}</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 mb-1">Real-World Application:</div>
                        <div className="text-gray-600">{course.realWorldApplication}</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.estimatedTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span>+{course.xpReward} XP</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-6">
                    {isCompleted ? (
                      <Badge className="bg-emerald-100 text-emerald-700">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Completed
                      </Badge>
                    ) : isUnlocked ? (
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Continue
                      </Button>
                    ) : canUnlock ? (
                      <Button 
                        onClick={() => onCourseUnlock(course.id)}
                        className="bg-yellow-600 hover:bg-yellow-700"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Unlock Now
                      </Button>
                    ) : (
                      <div className="text-center">
                        <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <div className="text-xs text-gray-500">
                          {course.xpRequired > userProgress.totalXP ? 
                            `${course.xpRequired - userProgress.totalXP} XP needed` :
                            'Complete prerequisites'
                          }
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {!isUnlocked && course.prerequisites.length > 0 && (
                  <Alert className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Prerequisites: Complete {course.prerequisites.map(prereq => 
                        courseProgression.find(c => c.id === prereq)?.title
                      ).join(', ')} first
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Next Steps Recommendation */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-6 h-6 text-purple-600" />
            <span>Recommended Next Steps</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getNextUnlockableXP() > 0 ? (
              <div>
                <p className="text-gray-700 mb-2">
                  You're {getNextUnlockableXP()} XP away from unlocking your next course!
                </p>
                <div className="text-sm text-gray-600">
                  💡 Complete daily lessons and practice exercises to earn XP faster
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-700 mb-2">
                  🎉 Great progress! You have courses available to unlock or continue.
                </p>
                <div className="text-sm text-gray-600">
                  Keep up the momentum and maintain your learning streak!
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseProgressionSystem;
