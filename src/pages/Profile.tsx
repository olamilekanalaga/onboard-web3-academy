import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Award,
  BookOpen,
  Target,
  TrendingUp,
  Clock,
  Flame
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { getDisplayName, getUserInitials } from "@/utils/userDisplay";
import Header from "@/components/Header";

const Profile = () => {
  const { user } = useAuth();
  const { data: profile } = useProfile();

  // Mock data for demonstration - in real app this would come from hooks
  const stats = {
    coursesCompleted: 3,
    totalCourses: 5,
    currentStreak: 7,
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
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl font-bold">
              {getUserInitials(profile, user)}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {getDisplayName(profile, user)}
          </h1>
          <p className="text-muted-foreground mb-4">{user?.email}</p>
          <Badge className="bg-emerald-600 text-white">Level {stats.level}</Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
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
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Flame className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">{stats.currentStreak}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
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
