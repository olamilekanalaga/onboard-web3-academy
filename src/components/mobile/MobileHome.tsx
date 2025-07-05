import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Play, ChevronRight, Target, Zap, User, Calendar, Star, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useCourseProgressionDB } from "@/hooks/useCourseProgressionDB";
import { useAppUsageTracking } from "@/hooks/useAppUsageTracking";
import { getDisplayName, getUserInitials } from "@/utils/userDisplay";
import MobileHeader from "./MobileHeader";
import BottomNavigation from "./BottomNavigation";
import PWALayout from "./PWALayout";
import PWAContentWrapper from "./PWAContentWrapper";
import { courses } from "@/data/courses";

const MobileHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const { userProgress } = useCourseProgressionDB();

  // Track app usage for streaks
  useAppUsageTracking();

  // Get total course count (all 12 courses)
  const totalCourses = Object.values(courses).length;

  // Get member since date
  const getMemberSince = () => {
    const joinDate = profile?.created_at || user?.created_at;
    if (!joinDate) return 'Recently';

    const date = new Date(joinDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} days ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  };

  // Get next course to continue
  const getNextCourse = () => {
    const courseOrder = [
      'foundation', 'beginner', 'intermediate', 'advanced',
      'defi', 'nft', 'dao', 'security', 'degen', 'advanced-trading',
      'institutional', 'developer'
    ];

    const completedCourses = userProgress?.completedCourses || [];

    for (const courseId of courseOrder) {
      if (!completedCourses.includes(courseId)) {
        return courses[courseId];
      }
    }

    return courses.foundation; // Default fallback
  };

  const nextCourse = getNextCourse();
  const completedCount = userProgress?.completedCourses?.length || 0;
  const progressPercentage = Math.round((completedCount / totalCourses) * 100);

  return (
    <PWALayout hasHeader={true} hasBottomNav={true} className="bg-gray-50">
      <MobileHeader title="" showBackButton={false} showMenu={true} />

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
                <span className="text-white text-lg font-bold">
                  {getUserInitials(profile, user)}
                </span>
              )}
            </div>
          </div>

          {/* Progress Overview */}
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-4 border border-emerald-100">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">Learning Progress</h3>
                <p className="text-sm text-gray-600">{completedCount} of {totalCourses} courses completed</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-600">{progressPercentage}%</div>
                <div className="text-xs text-gray-500">Complete</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Profile & Member Info Section */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Profile Button */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200" onClick={() => navigate('/mobile/profile')}>
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="text-sm font-semibold text-blue-700">View Profile</div>
                <div className="text-xs text-blue-600">Manage account</div>
              </CardContent>
            </Card>

            {/* Member Since */}
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div className="text-sm font-semibold text-amber-700">Member Since</div>
                <div className="text-xs text-amber-600">{getMemberSince()}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Special Note Section - Redesigned */}
        <div className="px-6 py-2">
          <Card className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-800 mb-1">🎉 Welcome to Academia!</h3>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    You're part of an exclusive community learning the future of finance. Complete courses, earn XP, and unlock new opportunities in the Web3 ecosystem!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievement Highlight */}
        <div className="px-6 py-2">
          <Card className="bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 border border-purple-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-800">Your Progress</h3>
                    <p className="text-sm text-purple-700">Keep learning to unlock rewards!</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-800">{userProgress?.completedCourses?.length || 0}</div>
                  <div className="text-xs text-purple-600">Courses Done</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-white border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200" onClick={() => navigate('/mobile/social')}>
              <CardContent className="p-3 text-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-xs font-medium text-gray-900">Social</div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200" onClick={() => navigate('/mobile/explore')}>
              <CardContent className="p-3 text-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-xs font-medium text-gray-900">Explore</div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200" onClick={() => navigate('/mobile/profile')}>
              <CardContent className="p-3 text-center">
                <div className="w-8 h-8 bg-purple-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <Trophy className="h-4 w-4 text-purple-600" />
                </div>
                <div className="text-xs font-medium text-gray-900">Achievements</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Learning Path - Redesigned */}
        <div className="px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Continue Learning</h2>

          {/* Next Course Card */}
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer" onClick={() => navigate('/mobile/explore')}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{nextCourse?.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{nextCourse?.description}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {nextCourse?.level}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {nextCourse?.lessons} lessons
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          {/* Start Learning Button */}
          <div className="mt-4">
            <Button
              onClick={() => navigate('/mobile/explore')}
              className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white py-3 rounded-xl font-medium"
            >
              <Play className="h-4 w-4 mr-2" />
              Explore All Courses
            </Button>
          </div>
        </div>

        {/* Bottom Padding for Navigation */}
        <div className="h-20"></div>

      </PWAContentWrapper>

      <BottomNavigation />
    </PWALayout>
  );
};

export default MobileHome;