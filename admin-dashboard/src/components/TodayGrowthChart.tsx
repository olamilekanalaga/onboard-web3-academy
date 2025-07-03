import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabaseAdmin } from '@/lib/supabase';

interface HourlyData {
  hour: string;
  newUsers: number;
  cumulativeUsers: number;
}

const TodayGrowthChart: React.FC = () => {
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [todayTotal, setTodayTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchTodayGrowth = async () => {
    try {
      // Get users from last 24 hours with their exact registration times
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      const { data: todayUsers, error } = await supabaseAdmin
        .from('profiles')
        .select('created_at')
        .gte('created_at', twentyFourHoursAgo.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Group users by hour
      const hourlyMap = new Map<string, number>();
      
      // Initialize all hours of today with 0
      for (let hour = 0; hour < 24; hour++) {
        const hourKey = hour.toString().padStart(2, '0') + ':00';
        hourlyMap.set(hourKey, 0);
      }

      // Count users per hour
      todayUsers?.forEach(user => {
        const userDate = new Date(user.created_at);
        const hour = userDate.getHours().toString().padStart(2, '0') + ':00';
        hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + 1);
      });

      // Convert to chart data with cumulative counts
      let cumulative = 0;
      const chartData: HourlyData[] = [];
      
      for (let hour = 0; hour < 24; hour++) {
        const hourKey = hour.toString().padStart(2, '0') + ':00';
        const newUsers = hourlyMap.get(hourKey) || 0;
        cumulative += newUsers;
        
        // Only show hours that have passed or have data
        const currentHour = new Date().getHours();
        if (hour <= currentHour || newUsers > 0) {
          chartData.push({
            hour: hourKey,
            newUsers,
            cumulativeUsers: cumulative
          });
        }
      }

      setHourlyData(chartData);
      setTodayTotal(todayUsers?.length || 0);

    } catch (error) {
      console.error('Error fetching today growth:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayGrowth();
    
    // Refresh every 5 minutes to show real-time growth
    const interval = setInterval(fetchTodayGrowth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getCurrentHourStats = () => {
    const currentHour = new Date().getHours();
    const currentHourKey = currentHour.toString().padStart(2, '0') + ':00';
    const currentHourData = hourlyData.find(d => d.hour === currentHourKey);
    return currentHourData?.newUsers || 0;
  };

  const getLastHourStats = () => {
    const lastHour = new Date().getHours() - 1;
    if (lastHour < 0) return 0;
    const lastHourKey = lastHour.toString().padStart(2, '0') + ':00';
    const lastHourData = hourlyData.find(d => d.hour === lastHourKey);
    return lastHourData?.newUsers || 0;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today's Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Last 24 Hours Growth</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Users className="w-3 h-3 mr-1" />
              {todayTotal} total (24h)
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{getCurrentHourStats()}</p>
            <p className="text-sm text-green-700">This hour</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{getLastHourStats()}</p>
            <p className="text-sm text-blue-700">Last hour</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="hour" 
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              labelFormatter={(value) => `Time: ${value}`}
              formatter={(value, name) => [
                value,
                name === 'newUsers' ? 'New Users' : 'Total Users'
              ]}
            />
            <Line
              type="monotone"
              dataKey="newUsers"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              name="New Users"
            />
            <Line
              type="monotone"
              dataKey="cumulativeUsers"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              name="Total Users"
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Updates every 5 minutes</span>
            <span className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>Live tracking</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodayGrowthChart;
