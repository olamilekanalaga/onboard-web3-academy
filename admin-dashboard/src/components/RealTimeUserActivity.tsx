import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, TrendingUp } from "lucide-react";
import { supabaseAdmin } from '@/lib/supabase';

interface RecentUser {
  username: string;
  full_name: string;
  email: string;
  created_at: string;
}

const RealTimeUserActivity: React.FC = () => {
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [todayCount, setTodayCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchRecentActivity = async () => {
    try {
      // Get recent users (last 10)
      const { data: users, error: usersError } = await supabaseAdmin
        .from('profiles')
        .select('username, full_name, email, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      if (usersError) throw usersError;
      setRecentUsers(users || []);

      // Get users from last 24 hours (more accurate than "today")
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      const { count, error: countError } = await supabaseAdmin
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', twentyFourHoursAgo.toISOString());

      if (countError) throw countError;
      setTodayCount(count || 0);

    } catch (error) {
      console.error('Error fetching user activity:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentActivity();
    
    // Refresh every 30 seconds to show new users joining
    const interval = setInterval(fetchRecentActivity, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const created = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const isRecent = (dateString: string) => {
    const now = new Date();
    const created = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
    return diffInMinutes < 60; // Less than 1 hour ago
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent User Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex space-x-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Recent User Activity</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <TrendingUp className="w-3 h-3 mr-1" />
              {todayCount} joined (24h)
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentUsers.map((user, index) => (
            <div
              key={`${user.email}-${index}`}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isRecent(user.created_at) 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-gray-50'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isRecent(user.created_at) 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-blue-100 text-blue-600'
              }`}>
                <Users className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-gray-900 truncate">
                    {user.full_name || user.username || 'Anonymous'}
                  </p>
                  {isRecent(user.created_at) && (
                    <Badge className="bg-green-500 text-white text-xs">NEW</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 truncate">{user.email}</p>
                {user.username && user.username !== user.full_name && (
                  <p className="text-xs text-gray-500">@{user.username}</p>
                )}
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{formatTimeAgo(user.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Live updates every 30 seconds</span>
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeUserActivity;
