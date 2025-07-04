
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Award,
  BookOpen,
  Target,
  TrendingUp,
  Clock,
  Flame,
  Users,
  UserPlus,
  Heart
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useStreakStats } from "@/hooks/useStreaks";
import { getUserInitials } from "@/utils/userDisplay";
import { getStreakBadge, getStreakMessage } from "@/utils/streakCalculator";
import Header from "@/components/Header";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const streakStats = useStreakStats();
  const [socialStats, setSocialStats] = useState({
    followers: 0,
    following: 0,
    reactions: 0
  });

  // Get real streak data
  const { currentStreak, longestStreak, isActive } = streakStats;
  const streakBadge = getStreakBadge(currentStreak);
  const streakMessage = getStreakMessage({
    currentStreak,
    longestStreak,
    lastActivityDate: null,
    streakStatus: isActive ? 'active' : 'new'
  });

  // Load social stats
  useEffect(() => {
    const loadSocialStats = async () => {
      if (!user) return;

      try {
        // Get followers count
        const { data: followersData } = await supabase
          .from('social_follows')
          .select('id')
          .eq('following_id', user.id);

        // Get following count
        const { data: followingData } = await supabase
          .from('social_follows')
          .select('id')
          .eq('follower_id', user.id);

        // Get reactions received count
        const { data: reactionsData } = await supabase
          .from('social_reactions')
          .select('id')
          .in('progress_id',
            await supabase
              .from('social_progress')
              .select('id')
              .eq('user_id', user.id)
              .then(res => res.data?.map(p => p.id) || [])
          );

        setSocialStats({
          followers: followersData?.length || 0,
          following: followingData?.length || 0,
          reactions: reactionsData?.length || 0
        });
      } catch (error) {
        console.error('Error loading social stats:', error);
      }
    };

    loadSocialStats();
  }, [user]);

  // Stats with real streak data
  const stats = {
    coursesCompleted: 3,
    totalCourses: 5,
    currentStreak, // Real streak data
    longestStreak, // Real longest streak
    totalXP: 2450,
    level: 5,
    achievements: 12,
    hoursLearned: 24
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-6">
            <ProfilePictureUpload
              currentAvatarUrl={profile?.avatar_url}
              userInitials={getUserInitials(profile, user)}
              size="lg"
            />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {profile?.full_name || profile?.username || 'User'}
          </h1>
          <p className="text-muted-foreground mb-4">@{profile?.username || 'user'}</p>
          <Badge className="bg-emerald-600 text-white">Level {stats.level}</Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BookOpen className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">{stats.coursesCompleted}</div>
              <div className="text-sm text-muted-foreground">Courses Completed</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className={`w-12 h-12 ${streakBadge.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                <span className="text-2xl">{streakBadge.emoji}</span>
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">{stats.currentStreak}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
              <div className="text-xs text-blue-600 mt-1">{streakBadge.title}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">{stats.hoursLearned}h</div>
              <div className="text-sm text-muted-foreground">Hours Learned</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">{stats.achievements}</div>
              <div className="text-sm text-muted-foreground">Achievements</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">{socialStats.followers}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <UserPlus className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">{socialStats.following}</div>
              <div className="text-sm text-muted-foreground">Following</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Heart className="h-6 w-6 text-pink-600" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">{socialStats.reactions}</div>
              <div className="text-sm text-muted-foreground">Reactions</div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                <span>Learning Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Course Progress</span>
                  <span>{stats.coursesCompleted}/{stats.totalCourses}</span>
                </div>
                <Progress value={(stats.coursesCompleted / stats.totalCourses) * 100} className="h-3" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-1">{stats.totalXP}</div>
                  <div className="text-sm text-muted-foreground">Total XP Earned</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Streak Message */}
          <Card className={`border-2 ${isActive ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'}`}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{isActive ? '🔥' : '💪'}</div>
                <div>
                  <p className={`font-medium ${isActive ? 'text-green-800' : 'text-blue-800'}`}>
                    {streakMessage}
                  </p>
                  {stats.longestStreak > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      Your longest streak: {stats.longestStreak} days
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span>Next Level</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Level Progress</span>
                  <span>{stats.totalXP % 500}/500 XP</span>
                </div>
                <Progress value={((stats.totalXP % 500) / 500) * 100} className="h-3" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{500 - (stats.totalXP % 500)}</div>
                  <div className="text-sm text-muted-foreground">XP to Next Level</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
