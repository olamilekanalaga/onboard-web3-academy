import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Calculator,
  Gamepad2,
  BarChart3
} from "lucide-react";
import Header from "@/components/Header";
import GamificationDashboard from "@/components/GamificationDashboard";
import SkillTree from "@/components/SkillTree";
import InteractiveToolsHub from "@/components/InteractiveToolsHub";
import {
  achievements,
  skillTrees,
  levelSystem,
  UserProgress,
  LeaderboardEntry
} from "@/data/gamification";

const Gamification = () => {
  // Real user data - starts at zero until courses are completed
  const [userProgress] = useState<UserProgress>({
    userId: "user123",
    totalXP: 0,
    level: levelSystem.getLevel(0),
    currentStreak: 0,
    longestStreak: 0,
    coursesCompleted: [],
    chaptersCompleted: [],
    achievementsUnlocked: [],
    badges: [],
    practiceSessionsCompleted: 0,
    communityContributions: 0,
    lastActiveDate: new Date(),
    skillLevels: {
      "Crypto Fundamentals": 0,
      "Blockchain Technology": 0,
      "DeFi Protocols": 0,
      "Security Practices": 0
    }
  });

  const [leaderboard] = useState<LeaderboardEntry[]>([
    {
      userId: "user123",
      username: "You",
      totalXP: 0,
      level: 1,
      rank: 1,
      weeklyXP: 0,
      monthlyXP: 0,
      specializations: []
    }
  ]);

  const handleAchievementClick = (achievementId: string) => {
    console.log("Achievement clicked:", achievementId);
  };

  const handleNodeClick = (nodeId: string) => {
    console.log("Skill node clicked:", nodeId);
  };

  const handleToolSelect = (toolId: string) => {
    console.log("Tool selected:", toolId);
  };

  const gamificationFeatures = [
    {
      icon: Trophy,
      title: "Achievement System",
      description: "Unlock badges and achievements as you progress through your learning journey",
      color: "bg-yellow-500",
      stats: "50+ Achievements"
    },
    {
      icon: Flame,
      title: "Learning Streaks",
      description: "Build momentum with daily learning streaks and earn bonus XP",
      color: "bg-orange-500",
      stats: "30+ Day Streaks"
    },
    {
      icon: TrendingUp,
      title: "Global Leaderboards",
      description: "Compete with learners worldwide and climb the rankings",
      color: "bg-blue-500",
      stats: "25k+ Learners"
    },
    {
      icon: Target,
      title: "Skill Trees",
      description: "Follow structured learning paths with visual progress tracking",
      color: "bg-purple-500",
      stats: "5 Skill Trees"
    }
  ];

  const interactiveFeatures = [
    {
      icon: Calculator,
      title: "DeFi Calculators",
      description: "Calculate yields, impermanent loss, and portfolio metrics",
      color: "bg-emerald-500",
      count: "8 Tools"
    },
    {
      icon: Gamepad2,
      title: "Practice Simulators",
      description: "Practice DeFi interactions with virtual funds",
      color: "bg-indigo-500",
      count: "Risk-Free"
    },
    {
      icon: BarChart3,
      title: "Market Analysis",
      description: "Real-time market data and analysis tools",
      color: "bg-pink-500",
      count: "Live Data"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Level Up Your
                <br />
                <span className="text-yellow-300">Crypto Learning</span>
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
                Experience the most engaging crypto education platform with gamification, interactive tools, and community features that make learning addictive.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-yellow-500 text-black hover:bg-yellow-400 px-10 py-4 text-lg font-semibold">
                <Trophy className="mr-2 h-5 w-5" />
                Start Earning XP
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-700 px-10 py-4 text-lg">
                <Gamepad2 className="mr-2 h-5 w-5" />
                Try Interactive Tools
              </Button>
            </div>

            {/* User Stats Preview */}
            <div className="flex items-center justify-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">{userProgress.totalXP}</div>
                <div className="text-blue-200 text-sm">Total XP</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">Level {userProgress.level}</div>
                <div className="text-blue-200 text-sm">{levelSystem.getLevelTitle(userProgress.level)}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-300">{userProgress.currentStreak}</div>
                <div className="text-blue-200 text-sm">Day Streak</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gamification Features */}
      <section className="py-20 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Gamified Learning Experience</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Turn your crypto education into an engaging game with achievements, streaks, and competitive elements.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {gamificationFeatures.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <div className="text-2xl font-bold text-blue-600">{feature.stats}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {interactiveFeatures.map((feature, index) => (
              <Card key={index} className={`bg-gradient-to-br from-gray-50 to-gray-100 border-0 hover:shadow-lg transition-all duration-300`}>
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 mx-auto rounded-full ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 mb-3">{feature.description}</p>
                  <div className="text-lg font-bold text-blue-600">{feature.count}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Dashboard */}
      <section className="py-20 px-4 md:px-6 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Learning Dashboard</h2>
            <p className="text-xl text-gray-600">
              Track your progress, achievements, and compete with other learners
            </p>
          </div>

          <Tabs defaultValue="dashboard" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="skills">Skill Trees</TabsTrigger>
              <TabsTrigger value="tools">Interactive Tools</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <GamificationDashboard
                userProgress={userProgress}
                achievements={achievements}
                leaderboard={leaderboard}
                onAchievementClick={handleAchievementClick}
              />
            </TabsContent>

            <TabsContent value="skills">
              <SkillTree
                skillTree={skillTrees[0]}
                userProgress={userProgress}
                onNodeClick={handleNodeClick}
              />
            </TabsContent>

            <TabsContent value="tools">
              <InteractiveToolsHub />
            </TabsContent>

            <TabsContent value="community">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-6 h-6 text-blue-500" />
                    <span>Community Features</span>
                  </CardTitle>
                  <CardDescription>
                    Connect with fellow learners and grow together
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Discussion Forums</h3>
                      <p className="text-gray-600">Join topic-specific discussions and get help from the community.</p>
                      <Button className="w-full">Join Discussions</Button>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Study Groups</h3>
                      <p className="text-gray-600">Form study groups with learners at your level and learn together.</p>
                      <Button className="w-full" variant="outline">Find Study Group</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">Ready to Start Your Journey?</h2>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Join thousands of learners who are already earning XP, unlocking achievements, and mastering crypto through our gamified platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-yellow-500 text-black hover:bg-yellow-400 px-10 py-4 text-lg font-semibold">
              <Star className="mr-2 h-5 w-5" />
              Start Learning Now
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-700 px-10 py-4 text-lg">
              View All Features
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gamification;
