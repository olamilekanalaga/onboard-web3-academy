import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Award,
  BookOpen,
  Target,
  TrendingUp,
  Edit,
  Save,
  X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { getDisplayName, getUserInitials } from "@/utils/userDisplay";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";

const Profile = () => {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: profile?.username || '',
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
  });

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync(editData);
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setEditData({
      username: profile?.username || '',
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
    });
    setIsEditing(false);
  };

  // Mock data for demonstration
  const stats = {
    coursesCompleted: 3,
    totalCourses: 5,
    currentStreak: 7,
    totalXP: 2450,
    level: 5,
    achievements: 12
  };

  const recentActivity = [
    { type: 'course_completed', title: 'DeFi Fundamentals', date: '2 days ago', xp: 500 },
    { type: 'achievement', title: 'First Course Complete', date: '1 week ago', xp: 100 },
    { type: 'course_started', title: 'Advanced Trading', date: '1 week ago', xp: 0 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
          <p className="text-muted-foreground">
            Manage your profile and track your learning progress
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Your personal details and contact information</CardDescription>
                </div>
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave} disabled={updateProfile.isPending}>
                      <Save className="h-4 w-4 mr-2" />
                      {updateProfile.isPending ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar and Basic Info */}
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {getUserInitials(profile, user)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground">
                      {getDisplayName(profile, user)}
                    </h3>
                    <p className="text-muted-foreground">{user?.email}</p>
                    <Badge className="mt-2">Level {stats.level}</Badge>
                  </div>
                </div>

                <Separator />

                {/* Editable Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    {isEditing ? (
                      <Input
                        id="username"
                        value={editData.username}
                        onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="Enter username"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{profile?.username || 'Not set'}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="full_name"
                        value={editData.full_name}
                        onChange={(e) => setEditData(prev => ({ ...prev, full_name: e.target.value }))}
                        placeholder="Enter full name"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{profile?.full_name || 'Not set'}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{user?.email}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editData.phone}
                        onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{profile?.phone || 'Not set'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest learning activities and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.type === 'course_completed' ? 'bg-green-100 text-green-600' :
                          activity.type === 'achievement' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {activity.type === 'course_completed' ? <BookOpen className="h-4 w-4" /> :
                           activity.type === 'achievement' ? <Award className="h-4 w-4" /> :
                           <Target className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.date}</p>
                        </div>
                      </div>
                      {activity.xp > 0 && (
                        <Badge variant="secondary">+{activity.xp} XP</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Learning Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Course Progress</span>
                    <span>{stats.coursesCompleted}/{stats.totalCourses}</span>
                  </div>
                  <Progress value={(stats.coursesCompleted / stats.totalCourses) * 100} />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-emerald-600">{stats.currentStreak}</div>
                    <div className="text-xs text-muted-foreground">Day Streak</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{stats.totalXP}</div>
                    <div className="text-xs text-muted-foreground">Total XP</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Achievements</span>
                    </div>
                    <Badge variant="secondary">{stats.achievements}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Level</span>
                    </div>
                    <Badge>{stats.level}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Continue Learning
                </Button>
                <Button className="w-full" variant="outline">
                  <Award className="h-4 w-4 mr-2" />
                  View Achievements
                </Button>
                <Button className="w-full" variant="outline">
                  <Target className="h-4 w-4 mr-2" />
                  Set Learning Goals
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
