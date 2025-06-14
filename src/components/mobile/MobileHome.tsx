import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Award, TrendingUp, Play, ChevronRight, Target, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSocialVerification } from "@/contexts/SocialVerificationContext";
import { useProfile } from "@/hooks/useProfile";
import { useCourseProgression } from "@/hooks/useCourseProgression";
import { getDisplayName, getUserInitials } from "@/utils/userDisplay";
import MobileHeader from "./MobileHeader";
import BottomNavigation from "./BottomNavigation";
import SocialVerification from "../SocialVerification";
import { courses } from "@/data/courses";

const MobileHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const { isVerified, setVerified } = useSocialVerification();
  const { isCourseUnlocked, userProgress } = useCourseProgression();
  const [showSocialVerification, setShowSocialVerification] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>("");

  // Get real course data - only show the modern courses we want to feature
  const featuredCourseIds = ["foundation", "defi", "degen"];
  const featuredCourses = Object.values(courses).filter(course => featuredCourseIds.includes(course.id));

  // Real user stats - no mock data
  const stats = [
    {
      label: "Courses Available",
      value: featuredCourses.length,
      icon: BookOpen,
      color: "text-emerald-600"
    },
    {
      label: "Learning Path",
      value: "Foundation",
      icon: Target,
      color: "text-blue-600"
    },
    {
      label: "Total XP",
      value: 0, // Real XP from completed courses
      icon: Zap,
      color: "text-amber-600"
    }
  ];

  const getIconForCourse = (courseId: string) => {
    switch (courseId) {
      case "foundation": return "🏗️";
      case "defi": return "🏦";
      case "degen": return "⚡";
      default: return "📖";
    }
  };

  const handleCourseNavigation = (courseId: string, courseName: string) => {
    if (isVerified) {
      // User is already verified, navigate directly
      navigate(`/mobile/course/${courseId}`);
    } else {
      // Show social verification modal
      setSelectedCourse(courseName);
      setShowSocialVerification(true);
    }
  };

  const handleSocialVerificationComplete = () => {
    setVerified(true);
    setShowSocialVerification(false);
    // Navigate to the selected course
    const courseId = featuredCourses.find(c => c.title === selectedCourse)?.id || "foundation";
    navigate(`/mobile/course/${courseId}`);
  };

  const handleSocialVerificationCancel = () => {
    setShowSocialVerification(false);
    setSelectedCourse("");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <MobileHeader />
      
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 to-blue-700 px-6 pt-12 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Welcome back, {getDisplayName(profile, user)}!
            </h1>
            <p className="text-emerald-100">Start your Web3 learning journey</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {getUserInitials(profile, user)}
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/15 rounded-xl p-4 text-center backdrop-blur-sm">
              <stat.icon className="h-6 w-6 text-white mx-auto mb-2" />
              <div className="text-lg font-bold text-white">{stat.value}</div>
              <div className="text-xs text-emerald-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Start Learning Section */}
      <div className="px-6 py-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Start Your Journey</h2>
        <Card className="border-0 shadow-sm bg-gradient-to-r from-emerald-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center text-2xl">
                🏗️
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 mb-1">Foundation Course</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Start with the basics - understand what money is and how crypto works
                </p>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => handleCourseNavigation('foundation', 'Foundation Course')}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Learning
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Path */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Your Learning Path</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/mobile/explore')}
          >
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className="space-y-4">
          {featuredCourses.map((course) => {
            const isUnlocked = isCourseUnlocked(course.id);
            return (
              <Card
                key={course.id}
                className={`border-0 shadow-sm transition-shadow ${isUnlocked ? 'cursor-pointer hover:shadow-md' : 'opacity-60'
                  }`}
                onClick={() => isUnlocked && handleCourseNavigation(course.id, course.title)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${isUnlocked
                      ? 'bg-gradient-to-br from-emerald-500 to-blue-600'
                      : 'bg-gray-400'
                      }`}>
                      {isUnlocked ? getIconForCourse(course.id) : '🔒'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-slate-900">{course.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {course.level}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-2 line-clamp-2">{course.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-slate-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {course.duration}
                        </div>
                        <span className="text-xs text-slate-500">
                          {isUnlocked ? 'Available' : 'Locked'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
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
                Explore All Courses
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MobileHome;
