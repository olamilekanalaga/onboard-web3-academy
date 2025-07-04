import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Play, ChevronRight, Target, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useCourseProgressionDB } from "@/hooks/useCourseProgressionDB";
import { getDisplayName, getUserInitials } from "@/utils/userDisplay";
import MobileHeader from "./MobileHeader";
import BottomNavigation from "./BottomNavigation";
import { courses } from "@/data/courses";
import PWALayout from "./PWALayout";
import PWAContentWrapper from "./PWAContentWrapper";

const MobileHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const { userProgress } = useCourseProgressionDB();

  // Debug to see what data we're getting
  console.log('Homepage - Profile:', profile);
  console.log('Homepage - User:', user);
  console.log('Homepage - UserProgress:', userProgress);

  // Get total course count (all 12 courses)
  const totalCourses = Object.values(courses).length;

  // Smart course title formatting for mobile
  const formatCourseTitle = (title: string) => {
    // Handle specific long titles with better abbreviations
    const titleMap: { [key: string]: string } = {
      'Blockchain Development Mastery': 'Blockchain Dev',
      'DeFi Fundamentals & Yield Farming': 'DeFi Fundamentals',
      'Advanced Trading Strategies': 'Advanced Trading',
      'Web3 Security & Best Practices': 'Web3 Security',
      'DAO Governance & Participation': 'DAO Governance',
      'Web3 Gaming & Metaverse': 'Web3 Gaming',
      'Cryptocurrency Tax Planning': 'Crypto Tax',
      'Web3 Social Media & Community Building': 'Web3 Social'
    };

    // Return mapped title if exists, otherwise truncate intelligently
    if (titleMap[title]) return titleMap[title];

    // For other titles, truncate at word boundaries
    if (title.length <= 16) return title;

    const words = title.split(' ');
    let result = words[0];
    for (let i = 1; i < words.length; i++) {
      if ((result + ' ' + words[i]).length <= 16) {
        result += ' ' + words[i];
      } else {
        break;
      }
    }
    return result.length < title.length ? result + '...' : result;
  };

  // Determine current learning path based on progress
  const getCurrentLearningPath = () => {
    if (!userProgress) return 'Foundation';

    const courseOrder = [
      'foundation',
      'defi-fundamentals',
      'degen',
      'advanced-trading',
      'development',
      'nft-creation',
      'content-creation',
      'web3-security',
      'dao-governance',
      'web3-gaming',
      'crypto-tax',
      'web3-social'
    ];

    // Find the first course that's not completed
    for (const courseId of courseOrder) {
      if (!userProgress.completedCourses.includes(courseId)) {
        const course = courses[courseId];
        return course ? formatCourseTitle(course.title) : 'Foundation';
      }
    }

    return "All Complete! 🎉";
  };

  // Format XP for better display
  const formatXP = (xp: number) => {
    if (xp >= 1000) {
      return `${(xp / 1000).toFixed(1)}k`;
    }
    return xp.toString();
  };

  // Get XP from the same source as profile page
  const getUserXP = () => {
    return userProgress?.totalXP || 0;
  };

  // Real user stats - no mock data
  const stats = [
    {
      label: "Courses Available",
      value: totalCourses, // Show all 12 courses
      icon: BookOpen,
      color: "text-blue-600"
    },
    {
      label: "Current Path",
      value: getCurrentLearningPath(),
      icon: Target,
      color: "text-purple-600"
    },
    {
      label: "Total XP",
      value: formatXP(getUserXP()), // Real XP from user stats with better fallback
      icon: Zap,
      color: "text-amber-600"
    }
  ];

  const getIconForCourse = (courseId: string) => {
    switch (courseId) {
      case "foundation": return "🏗️";
      case "defi-fundamentals": return "🏦";
      case "degen": return "⚡";
      case "advanced-trading": return "📈";
      case "development": return "💻";
      case "nft-creation": return "🎨";
      case "content-creation": return "📝";
      case "web3-security": return "🔒";
      case "dao-governance": return "🏛️";
      case "web3-gaming": return "🎮";
      case "crypto-tax": return "📊";
      case "web3-social": return "🌐";
      default: return "📖";
    }
  };

  // Get learning path courses in order
  const learningPathCourses = [
    'foundation',
    'defi-fundamentals',
    'degen',
    'advanced-trading',
    'development',
    'nft-creation'
  ].map(id => courses[id]).filter(Boolean);

  const handleCourseNavigation = (courseId: string) => {
    // Navigate directly to course
    navigate(`/mobile/course/${courseId}`);
  };

  return (
    <PWALayout hasHeader={true} hasBottomNav={true} className="bg-slate-50">
      <MobileHeader />

      <PWAContentWrapper padding="none">
        {/* Welcome Header - Redesigned */}
        <div className="bg-white px-6 pt-6 pb-8 border-b border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Welcome back, {getDisplayName(profile, user)}!
              </h1>
              <p className="text-gray-600">Continue your Web3 learning journey</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden shadow-lg">
              {(profile?.avatar_url || user?.user_metadata?.avatar_url) ? (
                <img
                  src={profile?.avatar_url || user?.user_metadata?.avatar_url}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-white font-bold text-xl">
                  {getUserInitials(profile, user)}
                </span>
              )}
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 text-center border border-gray-200 shadow-sm">
                <div className={`w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center ${
                  index === 0 ? 'bg-blue-100' :
                  index === 1 ? 'bg-purple-100' : 'bg-amber-100'
                }`}>
                  <stat.icon className={`h-5 w-5 ${
                    index === 0 ? 'text-blue-600' :
                    index === 1 ? 'text-purple-600' : 'text-amber-600'
                  }`} />
                </div>
                <div className={`text-xl font-bold ${
                  index === 0 ? 'text-blue-600' :
                  index === 1 ? 'text-purple-600' : 'text-amber-600'
                }`}>
                  {stat.value}
                </div>
                <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Start Learning Section - Redesigned */}
        <div className="px-6 py-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Start Your Journey</h2>
          <Card className="border border-gray-200 shadow-lg bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                  🏗️
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1 text-lg">Foundation Course</h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    Start with the basics - understand what money is and how crypto works
                  </p>
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
                    onClick={() => handleCourseNavigation('foundation')}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Learning
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      {/* Learning Path - Redesigned */}
      <div className="px-6 py-6 content-safe-bottom">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Your Learning Path</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/mobile/explore')}
            className="text-blue-600 hover:text-blue-700"
          >
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className="space-y-4">
          {learningPathCourses.map((course) => {
            const isCompleted = userProgress?.completedCourses.includes(course.id) || false;

            return (
              <Card
                key={course.id}
                className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer bg-white"
                onClick={() => handleCourseNavigation(course.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm ${
                      isCompleted
                        ? 'bg-gradient-to-br from-green-500 to-green-600'
                        : 'bg-gradient-to-br from-blue-500 to-purple-600'
                      }`}>
                      {isCompleted ? '✅' : getIconForCourse(course.id)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0 pr-2">
                          <h3 className="font-semibold text-gray-900 text-base leading-tight">
                            {formatCourseTitle(course.title)}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {course.description}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          {isCompleted ? (
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              Complete
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                              {course.level || 'Beginner'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

        {/* Call to Action */}
        <div className="mt-6">
          <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-600 to-emerald-600">
            <CardContent className="p-6 text-center text-white">
              <h3 className="text-lg font-bold mb-2">Ready to Start?</h3>
              <p className="text-blue-100 mb-4">
                Begin with our Foundation course and unlock advanced topics as you progress
              </p>
              <Button
                className="bg-white text-blue-600 hover:bg-blue-50"
                onClick={() => navigate('/mobile/explore')}
              >
                View All Courses
              </Button>
            </CardContent>
          </Card>
        </div>
      </PWAContentWrapper>

      <BottomNavigation />
    </PWALayout>
  );
};

export default MobileHome;
