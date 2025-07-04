import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  Globe,
  Calendar,
  Award,
  BookOpen,
  Zap,
  TrendingUp,
  Clock,
  Activity,
  ArrowLeft,
  Download,
  MessageSquare,
  Ban,
  CheckCircle
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
// import { motion } from 'framer-motion'; // Temporarily disabled
import { useUserActivityTimeline } from '@/hooks/useAdminData';

interface UserProfileDetailProps {
  user: {
    user_id: string;
    email: string;
    full_name: string;
    country_name: string;
    total_xp: number;
    current_level: number;
    completed_courses: string[];
    current_streak: number;
    longest_streak: number;
    total_study_time: number;
    last_activity_date: string;
    created_at: string;
    course_completion_rate: number;
  };
  onBack: () => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const UserProfileDetail: React.FC<UserProfileDetailProps> = ({ user, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { data: activityTimeline, isLoading: timelineLoading } = useUserActivityTimeline(user.user_id);

  // Mock data for demonstration - replace with real data
  const progressData = [
    { month: 'Jan', xp: 120, courses: 1 },
    { month: 'Feb', xp: 250, courses: 2 },
    { month: 'Mar', xp: 400, courses: 3 },
    { month: 'Apr', xp: 580, courses: 4 },
    { month: 'May', xp: 750, courses: 5 },
    { month: 'Jun', xp: user.total_xp, courses: user.completed_courses.length }
  ];

  const courseDistribution = [
    { name: 'Foundation', value: 30, color: '#0088FE' },
    { name: 'DeFi', value: 25, color: '#00C49F' },
    { name: 'Trading', value: 20, color: '#FFBB28' },
    { name: 'Development', value: 15, color: '#FF8042' },
    { name: 'Security', value: 10, color: '#8884D8' }
  ];

  const getLevelBadgeColor = (level: number) => {
    if (level >= 10) return 'bg-purple-500';
    if (level >= 7) return 'bg-blue-500';
    if (level >= 4) return 'bg-green-500';
    return 'bg-gray-500';
  };

  const getStreakBadgeColor = (streak: number) => {
    if (streak >= 30) return 'bg-red-500';
    if (streak >= 14) return 'bg-orange-500';
    if (streak >= 7) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.full_name || 'Anonymous User'}
            </h1>
            <p className="text-gray-600">@{user.username || 'user'}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            Message
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* User Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Award className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Level</p>
                <div className="flex items-center space-x-2">
                  <p className="text-xl font-bold">{user.current_level}</p>
                  <Badge className={`${getLevelBadgeColor(user.current_level)} text-white`}>
                    {user.current_level >= 10 ? 'Expert' : 
                     user.current_level >= 7 ? 'Advanced' : 
                     user.current_level >= 4 ? 'Intermediate' : 'Beginner'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total XP</p>
                <p className="text-xl font-bold">{user.total_xp.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Streak</p>
                <div className="flex items-center space-x-2">
                  <p className="text-xl font-bold">{user.current_streak}</p>
                  <Badge className={`${getStreakBadgeColor(user.current_streak)} text-white`}>
                    {user.current_streak >= 30 ? '🔥' : 
                     user.current_streak >= 14 ? '⚡' : 
                     user.current_streak >= 7 ? '✨' : '📚'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Courses Completed</p>
                <p className="text-xl font-bold">{user.completed_courses.length}</p>
                <p className="text-xs text-gray-500">
                  {user.course_completion_rate.toFixed(1)}% completion rate
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{user.country_name || 'Unknown'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    Joined {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Activity className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    Last active {new Date(user.last_activity_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    {Math.round(user.total_study_time / 60)} hours studied
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Course Progress</span>
                    <span className="text-sm font-medium">
                      {user.course_completion_rate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${user.course_completion_rate}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{user.longest_streak}</p>
                    <p className="text-xs text-gray-600">Longest Streak</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {Math.round(user.total_xp / (user.completed_courses.length || 1))}
                    </p>
                    <p className="text-xs text-gray-600">Avg XP per Course</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="xp"
                    stroke="#8884d8"
                    strokeWidth={2}
                    name="XP Earned"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="courses"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    name="Courses Completed"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {timelineLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {activityTimeline?.slice(0, 10).map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Activity className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.activity_description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.activity_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline">{activity.activity_type}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Completed Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {user.completed_courses.map((course, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium">{course}</span>
                      </div>
                      <Badge variant="outline">Completed</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Course Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={courseDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {courseDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfileDetail;
