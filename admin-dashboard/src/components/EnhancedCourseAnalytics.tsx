import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Users,
  TrendingUp,
  Award,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Download,
  RefreshCw,
  Globe,
  Star,
  Zap
} from "lucide-react";
import { supabaseAdmin } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface CourseProgressData {
  user_id: string;
  username: string;
  display_name: string;
  email: string;
  country: string;
  total_courses: number;
  completed_courses: number;
  in_progress_courses: number;
  total_xp: number;
  completion_rate: number;
  level: string;
  last_activity: string;
  course_details: any[];
}

interface CourseStats {
  course_id: string;
  course_name: string;
  total_enrollments: number;
  completions: number;
  completion_rate: number;
  average_time: number;
  difficulty_rating: number;
}

const EnhancedCourseAnalytics = () => {
  const [courseProgressData, setCourseProgressData] = useState<CourseProgressData[]>([]);
  const [courseStats, setCourseStats] = useState<CourseStats[]>([]);
  const [countryStats, setCountryStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Course list for reference
  const courseList = [
    { id: 'foundation', name: 'Foundation Course', level: 'Beginner' },
    { id: 'defi-fundamentals', name: 'DeFi Fundamentals', level: 'Intermediate' },
    { id: 'degen', name: 'Degen Course', level: 'Advanced' },
    { id: 'advanced-trading', name: 'Advanced Trading', level: 'Advanced' },
    { id: 'development', name: 'Web3 Development', level: 'Advanced' },
    { id: 'nft-creation', name: 'NFT Creation', level: 'Intermediate' },
    { id: 'content-creation', name: 'Content Creation', level: 'Beginner' },
    { id: 'web3-security', name: 'Web3 Security', level: 'Advanced' },
    { id: 'dao-governance', name: 'DAO Governance', level: 'Intermediate' },
    { id: 'web3-gaming', name: 'Web3 Gaming', level: 'Intermediate' },
    { id: 'crypto-tax', name: 'Crypto Tax', level: 'Beginner' },
    { id: 'web3-social', name: 'Web3 Social', level: 'Intermediate' }
  ];

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadCourseProgressData(),
        loadCourseStats(),
        loadCountryStats()
      ]);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading course analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCourseProgressData = async () => {
    try {
      console.log('Loading course progress data...');
      
      // Get all users with their profiles
      const { data: users, error: usersError } = await supabaseAdmin
        .from('profiles')
        .select(`
          id,
          username,
          display_name,
          email,
          country,
          created_at
        `);

      if (usersError) throw usersError;

      // Get user progress for each user
      const progressPromises = users?.map(async (user) => {
        const { data: progress, error: progressError } = await supabaseAdmin
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id);

        const { data: stats, error: statsError } = await supabaseAdmin
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (progressError) console.error('Progress error for user', user.id, progressError);
        if (statsError) console.error('Stats error for user', user.id, statsError);

        const courseProgress = progress || [];
        const completedCourses = courseProgress.filter(p => p.progress_percentage >= 100).length;
        const inProgressCourses = courseProgress.filter(p => p.progress_percentage > 0 && p.progress_percentage < 100).length;
        const totalXP = stats?.total_xp || 0;
        const completionRate = courseList.length > 0 ? (completedCourses / courseList.length) * 100 : 0;

        // Determine user level based on completed courses
        let level = 'Beginner';
        if (completedCourses >= 8) level = 'Expert';
        else if (completedCourses >= 5) level = 'Advanced';
        else if (completedCourses >= 2) level = 'Intermediate';

        return {
          user_id: user.id,
          username: user.username || 'Unknown',
          display_name: user.display_name || user.username || 'Unknown User',
          email: user.email || 'No email',
          country: user.country || 'Unknown',
          total_courses: courseList.length,
          completed_courses: completedCourses,
          in_progress_courses: inProgressCourses,
          total_xp: totalXP,
          completion_rate: Math.round(completionRate),
          level,
          last_activity: courseProgress.length > 0 
            ? courseProgress.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0].updated_at
            : user.created_at,
          course_details: courseProgress
        };
      }) || [];

      const progressData = await Promise.all(progressPromises);
      setCourseProgressData(progressData);
      console.log('Loaded course progress for', progressData.length, 'users');

    } catch (error) {
      console.error('Error loading course progress data:', error);
    }
  };

  const loadCourseStats = async () => {
    try {
      console.log('Loading course statistics...');
      
      const courseStatsPromises = courseList.map(async (course) => {
        const { data: progress, error } = await supabaseAdmin
          .from('user_progress')
          .select('*')
          .eq('course_id', course.id);

        if (error) {
          console.error(`Error loading stats for ${course.id}:`, error);
          return {
            course_id: course.id,
            course_name: course.name,
            total_enrollments: 0,
            completions: 0,
            completion_rate: 0,
            average_time: 0,
            difficulty_rating: course.level === 'Beginner' ? 2 : course.level === 'Intermediate' ? 3 : 4
          };
        }

        const enrollments = progress?.length || 0;
        const completions = progress?.filter(p => p.progress_percentage >= 100).length || 0;
        const completionRate = enrollments > 0 ? (completions / enrollments) * 100 : 0;

        return {
          course_id: course.id,
          course_name: course.name,
          total_enrollments: enrollments,
          completions,
          completion_rate: Math.round(completionRate),
          average_time: Math.floor(Math.random() * 10) + 5, // Simulated for now
          difficulty_rating: course.level === 'Beginner' ? 2 : course.level === 'Intermediate' ? 3 : 4
        };
      });

      const stats = await Promise.all(courseStatsPromises);
      setCourseStats(stats);
      console.log('Loaded statistics for', stats.length, 'courses');

    } catch (error) {
      console.error('Error loading course stats:', error);
    }
  };

  const loadCountryStats = async () => {
    try {
      console.log('Loading country statistics...');
      
      const { data: profiles, error } = await supabaseAdmin
        .from('profiles')
        .select('country');

      if (error) throw error;

      // Group by country
      const countryGroups: { [key: string]: number } = {};
      profiles?.forEach(profile => {
        const country = profile.country || 'Unknown';
        countryGroups[country] = (countryGroups[country] || 0) + 1;
      });

      const countryData = Object.entries(countryGroups)
        .map(([country, count]) => ({ country, users: count }))
        .sort((a, b) => b.users - a.users)
        .slice(0, 10);

      setCountryStats(countryData);
      console.log('Loaded country stats for', countryData.length, 'countries');

    } catch (error) {
      console.error('Error loading country stats:', error);
    }
  };

  useEffect(() => {
    loadAllData();
    
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(loadAllData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate summary statistics
  const totalUsers = courseProgressData.length;
  const totalCompletions = courseProgressData.reduce((sum, user) => sum + user.completed_courses, 0);
  const averageCompletionRate = totalUsers > 0 
    ? Math.round(courseProgressData.reduce((sum, user) => sum + user.completion_rate, 0) / totalUsers)
    : 0;
  const totalXPAwarded = courseProgressData.reduce((sum, user) => sum + user.total_xp, 0);

  // Level distribution
  const levelDistribution = courseProgressData.reduce((acc, user) => {
    acc[user.level] = (acc[user.level] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const levelChartData = Object.entries(levelDistribution).map(([level, count]) => ({
    level,
    count,
    percentage: totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Course Analytics</h2>
          <p className="text-gray-600">Comprehensive course progression and user analytics</p>
        </div>
        <div className="flex items-center space-x-3">
          {lastUpdated && (
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <Button onClick={loadAllData} disabled={loading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Active learners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Course Completions</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompletions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total completions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageCompletionRate}%</div>
            <p className="text-xs text-muted-foreground">Per user average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total XP Awarded</CardTitle>
            <Zap className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalXPAwarded.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Experience points</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progression">User Progression</TabsTrigger>
          <TabsTrigger value="courses">Course Stats</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Level Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>User Level Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={levelChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ level, percentage }) => `${level} (${percentage}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {levelChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Course Completion Rates */}
            <Card>
              <CardHeader>
                <CardTitle>Course Completion Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={courseStats.slice(0, 6)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="course_name"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      fontSize={12}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completion_rate" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* User Progression Tab */}
        <TabsContent value="progression" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>All User Course Progression</span>
                <Badge variant="secondary">{courseProgressData.length} users</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">User</th>
                        <th className="text-left p-2">Country</th>
                        <th className="text-left p-2">Level</th>
                        <th className="text-left p-2">Completed</th>
                        <th className="text-left p-2">In Progress</th>
                        <th className="text-left p-2">Completion Rate</th>
                        <th className="text-left p-2">Total XP</th>
                        <th className="text-left p-2">Last Activity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courseProgressData
                        .sort((a, b) => b.completed_courses - a.completed_courses)
                        .slice(0, 50)
                        .map((user) => (
                        <tr key={user.user_id} className="border-b hover:bg-gray-50">
                          <td className="p-2">
                            <div>
                              <div className="font-medium">{user.display_name}</div>
                              <div className="text-gray-500 text-xs">@{user.username}</div>
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="flex items-center space-x-1">
                              <Globe className="h-3 w-3 text-gray-400" />
                              <span>{user.country}</span>
                            </div>
                          </td>
                          <td className="p-2">
                            <Badge
                              variant={
                                user.level === 'Expert' ? 'default' :
                                user.level === 'Advanced' ? 'secondary' :
                                user.level === 'Intermediate' ? 'outline' : 'secondary'
                              }
                            >
                              {user.level}
                            </Badge>
                          </td>
                          <td className="p-2">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="font-medium">{user.completed_courses}</span>
                              <span className="text-gray-500">/ {user.total_courses}</span>
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-orange-600" />
                              <span>{user.in_progress_courses}</span>
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="flex items-center space-x-2">
                              <Progress value={user.completion_rate} className="w-16" />
                              <span className="text-sm font-medium">{user.completion_rate}%</span>
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="flex items-center space-x-1">
                              <Zap className="h-3 w-3 text-purple-600" />
                              <span className="font-medium">{user.total_xp.toLocaleString()}</span>
                            </div>
                          </td>
                          <td className="p-2 text-gray-500 text-xs">
                            {new Date(user.last_activity).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {courseProgressData.length > 50 && (
                    <div className="mt-4 text-center">
                      <Button variant="outline">
                        Load More Users ({courseProgressData.length - 50} remaining)
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Course Stats Tab */}
        <TabsContent value="courses" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courseStats.map((course) => (
              <Card key={course.course_id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{course.course_name}</span>
                    <Badge variant="outline">{course.completion_rate}% completion</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Enrollments</span>
                      <span className="font-medium">{course.total_enrollments}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Completions</span>
                      <span className="font-medium text-green-600">{course.completions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Difficulty</span>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < course.difficulty_rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <Progress value={course.completion_rate} className="w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Geographic Tab */}
        <TabsContent value="geographic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Users by Country</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={countryStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="country" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedCourseAnalytics;
