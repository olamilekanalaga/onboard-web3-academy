import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Users,
  TrendingUp,
  Download,
  BarChart3,
  BookOpen,
  Award,
  MapPin
} from "lucide-react";
import { supabaseAdmin } from '@/lib/supabase';

const UserAnalytics = () => {
  const [countryStats, setCountryStats] = useState<any[]>([]);
  const [userGrowth, setUserGrowth] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load country statistics
  const loadCountryStats = async () => {
    try {
      // Use the same method as GeographicAnalytics for consistency
      const { data: profiles, error } = await supabaseAdmin
        .from('profiles')
        .select('country_code, country_name')
        .not('country_code', 'is', null);

      if (error) throw error;

      // Group by country and count users
      const countryGroups: { [key: string]: any } = {};
      profiles?.forEach(profile => {
        const code = profile.country_code;
        const name = profile.country_name || 'Unknown';

        if (!countryGroups[code]) {
          countryGroups[code] = {
            country_code: code,
            country_name: name,
            user_count: 0
          };
        }
        countryGroups[code].user_count++;
      });

      const countryData = Object.values(countryGroups);
      console.log('Country stats loaded:', countryData.length, 'countries');
      setCountryStats(countryData);
    } catch (error: any) {
      console.error('Error loading country stats:', error);
      setCountryStats([]);
    }
  };

  // Load user growth data
  const loadUserGrowth = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('created_at')
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Group by month
      const monthlyGrowth: any = {};
      data?.forEach(profile => {
        const month = new Date(profile.created_at).toISOString().slice(0, 7);
        monthlyGrowth[month] = (monthlyGrowth[month] || 0) + 1;
      });

      const growthData = Object.entries(monthlyGrowth).map(([month, count]) => ({
        month,
        users: count,
        cumulative: Object.entries(monthlyGrowth)
          .filter(([m]) => m <= month)
          .reduce((sum, [, c]) => sum + (c as number), 0)
      }));

      setUserGrowth(growthData);
      setTotalUsers(data?.length || 0);
    } catch (error: any) {
      console.error('Error loading user growth:', error);
    }
  };

  // Load course analytics
  const [courseStats, setCourseStats] = useState<any>({});
  const loadCourseStats = async () => {
    try {
      console.log('Loading course stats...');

      // Get total user count using the same method as other components
      const { count: totalUsers, error: countError } = await supabaseAdmin
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error('Error loading user count:', countError);
        throw countError;
      }

      console.log('Total users found:', totalUsers || 0);

      // Skip user_progress query - we'll use user_stats for consistency

      // Get user stats for XP data
      const { data: userStatsData, error: statsError } = await supabaseAdmin
        .from('user_stats')
        .select('user_id, total_xp, completed_courses, level');

      if (statsError) {
        console.error('Error loading user stats:', statsError);
        // Don't throw, use fallback data
      }

      console.log('User stats found:', userStatsData?.length || 0);

      // Calculate course completion stats using the same method as Overview page
      // This ensures consistency between Course Analytics and Overview
      const totalCourseCompletions = userStatsData?.reduce((sum, stat) =>
        sum + (stat.completed_courses?.length || 0), 0) || 0;

      const totalXP = userStatsData?.reduce((sum, user) => sum + (user.total_xp || 0), 0) || 0;
      const avgLevel = userStatsData?.length > 0
        ? userStatsData.reduce((sum, user) => sum + (user.level || 1), 0) / userStatsData.length
        : 1;

      const stats = {
        total_users: totalUsers || 0,
        completed_courses: totalCourseCompletions,
        total_xp: totalXP,
        average_level: Math.round(avgLevel * 10) / 10,
        active_learners: userStatsData?.filter(u => u.total_xp > 0).length || 0
      };

      console.log('Final course stats:', stats);
      setCourseStats(stats);
    } catch (error: any) {
      console.error('Error loading course stats:', error);
      // Set fallback data
      setCourseStats({
        total_users: 0,
        completed_courses: 0,
        total_xp: 0,
        average_level: 1,
        active_learners: 0
      });
    }
  };

  // Load all analytics
  const loadAnalytics = async () => {
    setLoading(true);
    await Promise.all([
      loadCountryStats(),
      loadUserGrowth(),
      loadCourseStats()
    ]);
    setLoading(false);
  };

  // Export data
  const exportData = () => {
    const data = {
      countryStats,
      userGrowth,
      bookingStats,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <span>Platform Analytics</span>
            </CardTitle>
            <div className="flex space-x-2">
              <Button onClick={loadAnalytics} disabled={loading}>
                {loading ? 'Loading...' : 'Refresh'}
              </Button>
              <Button onClick={exportData} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Users</p>
                <p className="text-3xl font-bold text-slate-900">{(courseStats.total_users || totalUsers || 0).toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  Active platform
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Countries</p>
                <p className="text-3xl font-bold text-slate-900">
                  {countryStats.filter(c => c.user_count > 0).length}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  <Globe className="w-3 h-3 inline mr-1" />
                  Global reach
                </p>
              </div>
              <Globe className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Completed Courses</p>
                <p className="text-3xl font-bold text-slate-900">
                  {courseStats.completed_courses || 0}
                </p>
                <p className="text-sm text-purple-600 mt-1">
                  <BookOpen className="w-3 h-3 inline mr-1" />
                  Course completions
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total XP Earned</p>
                <p className="text-3xl font-bold text-slate-900">
                  {courseStats.total_xp?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-yellow-600 mt-1">
                  <Award className="w-3 h-3 inline mr-1" />
                  Experience points
                </p>
              </div>
              <Award className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Country Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-green-600" />
            <span>Users by Country</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p>Loading country data...</p>
            </div>
          ) : countryStats.length === 0 ? (
            <div className="text-center py-8">
              <Globe className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No Country Data</h3>
              <p className="text-slate-500">User country data will appear here once users sign up.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Top Countries */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {countryStats
                  .filter(country => country.user_count > 0)
                  .slice(0, 9)
                  .map((country, index) => (
                    <div key={country.country_code} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{country.flag_emoji}</span>
                        <div>
                          <p className="font-semibold text-slate-900">{country.country_name}</p>
                          <p className="text-sm text-slate-600">#{index + 1} most users</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900">{country.user_count}</p>
                        <p className="text-sm text-slate-600">
                          {((country.user_count / totalUsers) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

              {/* All Countries Table */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-slate-900 mb-4">Complete Country Breakdown</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 font-medium text-slate-600">Rank</th>
                        <th className="text-left py-2 font-medium text-slate-600">Country</th>
                        <th className="text-right py-2 font-medium text-slate-600">Users</th>
                        <th className="text-right py-2 font-medium text-slate-600">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {countryStats
                        .filter(country => country.user_count > 0)
                        .map((country, index) => (
                          <tr key={country.country_code} className="border-b border-slate-100">
                            <td className="py-2 text-slate-600">#{index + 1}</td>
                            <td className="py-2">
                              <div className="flex items-center space-x-2">
                                <span>{country.flag_emoji}</span>
                                <span className="font-medium text-slate-900">{country.country_name}</span>
                                <span className="text-slate-500 text-xs">({country.country_code})</span>
                              </div>
                            </td>
                            <td className="py-2 text-right font-semibold text-slate-900">
                              {country.user_count}
                            </td>
                            <td className="py-2 text-right text-slate-600">
                              {((country.user_count / totalUsers) * 100).toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Growth */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span>User Growth Over Time</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userGrowth.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No Growth Data</h3>
              <p className="text-slate-500">User growth data will appear here as users sign up over time.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-800">
                    {userGrowth[userGrowth.length - 1]?.users || 0}
                  </p>
                  <p className="text-sm text-blue-600">New users this month</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-800">
                    {(userGrowth.reduce((sum, month) => sum + month.users, 0) / userGrowth.length).toFixed(0)}
                  </p>
                  <p className="text-sm text-green-600">Avg users per month</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-800">
                    {userGrowth.length}
                  </p>
                  <p className="text-sm text-purple-600">Months active</p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-lg font-semibold text-slate-900 mb-4">Monthly Growth</h4>
                <div className="space-y-2">
                  {userGrowth.slice(-12).map((month) => (
                    <div key={month.month} className="flex items-center justify-between p-3 bg-slate-50 rounded">
                      <span className="font-medium text-slate-900">
                        {new Date(month.month + '-01').toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long' 
                        })}
                      </span>
                      <div className="text-right">
                        <span className="font-bold text-slate-900">+{month.users}</span>
                        <span className="text-slate-500 text-sm ml-2">
                          (Total: {month.cumulative})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAnalytics;
