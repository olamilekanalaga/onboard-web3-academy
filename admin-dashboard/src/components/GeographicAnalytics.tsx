import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Globe,
  Users,
  DollarSign,
  TrendingUp,
  MapPin,
  Activity,
  Award,
  Filter
} from "lucide-react";
// Note: World map functionality temporarily disabled due to dependency issues
// import {
//   ComposableMap,
//   Geographies,
//   Geography,
//   Marker,
//   ZoomableGroup
// } from "react-simple-maps";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
// import { motion } from 'framer-motion'; // Temporarily disabled
import { useEnhancedUserCountryStats } from '@/hooks/useAdminData';

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

interface CountryData {
  country_name: string;
  country_code: string;
  flag_emoji: string;
  user_count: number;
  active_users: number;
  avg_xp: number;
}

const GeographicAnalytics: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [mapView, setMapView] = useState<'users' | 'xp' | 'engagement'>('users');
  
  const { data: countryStats, isLoading } = useEnhancedUserCountryStats();

  // Process data for visualizations
  const topCountries = countryStats?.slice(0, 10) || [];
  const totalUsers = countryStats?.reduce((sum, country) => sum + country.user_count, 0) || 0;
  const totalActiveUsers = countryStats?.reduce((sum, country) => sum + country.active_users, 0) || 0;

  // Get the top actual country (excluding "Not Set")
  const topActualCountry = countryStats?.find(country => country.country_code !== 'XX') || topCountries[0];

  // Prepare data for charts - prioritize actual countries over "Not Set"
  const actualCountries = topCountries.filter(country => country.country_code !== 'XX');
  const notSetCountry = topCountries.find(country => country.country_code === 'XX');

  const countryChartData = [
    ...actualCountries.map(country => ({
      name: country.country_name,
      users: country.user_count,
      avgXp: country.avg_xp,
      activeUsers: country.active_users,
      engagementRate: country.user_count > 0 ? (country.active_users / country.user_count * 100) : 0
    })),
    ...(notSetCountry ? [{
      name: notSetCountry.country_name,
      users: notSetCountry.user_count,
      avgXp: notSetCountry.avg_xp,
      activeUsers: notSetCountry.active_users,
      engagementRate: notSetCountry.user_count > 0 ? (notSetCountry.active_users / notSetCountry.user_count * 100) : 0
    }] : [])
  ];

  const pieChartData = topCountries.map((country, index) => ({
    name: country.country_name,
    value: country.user_count,
    color: COLORS[index % COLORS.length]
  }));

  // Get color intensity based on user count for map
  const getCountryColor = (countryCode: string) => {
    const country = countryStats?.find(c => c.country_code === countryCode);
    if (!country) return '#f0f0f0';
    
    const maxUsers = Math.max(...(countryStats?.map(c => c.user_count) || [1]));
    const intensity = country.user_count / maxUsers;
    
    if (mapView === 'users') {
      return `rgba(59, 130, 246, ${0.2 + intensity * 0.8})`;
    } else if (mapView === 'engagement') {
      const engagementRate = country.user_count > 0 ? country.active_users / country.user_count : 0;
      return `rgba(168, 85, 247, ${0.2 + engagementRate * 0.8})`;
    } else {
      const maxXp = Math.max(...(countryStats?.map(c => c.avg_xp) || [1]));
      const xpIntensity = country.avg_xp / maxXp;
      return `rgba(34, 197, 94, ${0.2 + xpIntensity * 0.8})`;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Geographic Analytics</h2>
          <p className="text-gray-600">Global user distribution and engagement metrics</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Countries</p>
                <p className="text-2xl font-bold">{countryStats?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold">{formatNumber(totalActiveUsers)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Top Country</p>
                <p className="text-lg font-bold">
                  {topActualCountry?.flag_emoji} {topActualCountry?.country_name}
                </p>
                {topActualCountry && (
                  <p className="text-xs text-gray-500">
                    {topActualCountry.user_count} user{topActualCountry.user_count !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="map" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="map">World Map</TabsTrigger>
          <TabsTrigger value="countries">Top Countries</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Global User Distribution</CardTitle>
                <div className="flex space-x-2">
                  {(['users', 'xp', 'engagement'] as const).map((view) => (
                    <Button
                      key={view}
                      variant={mapView === view ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setMapView(view)}
                    >
                      {view === 'xp' ? 'XP' : view.charAt(0).toUpperCase() + view.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full h-96 bg-gray-50 rounded-lg p-6 flex items-center justify-center">
                <div className="text-center">
                  <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Interactive World Map</h3>
                  <p className="text-gray-500 mb-4">
                    World map visualization will be available after installing map dependencies.
                  </p>
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    {topCountries.slice(0, 4).map((country, index) => (
                      <div
                        key={country.country_code}
                        className="p-3 bg-white rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedCountry(country)}
                      >
                        <div className="text-2xl mb-1">{country.flag_emoji}</div>
                        <div className="text-sm font-medium">{country.country_name}</div>
                        <div className="text-xs text-gray-500">{country.user_count} users</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="mt-4 flex justify-center">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-200 rounded"></div>
                    <span>Low</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span>Medium</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-800 rounded"></div>
                    <span>High</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Country Details */}
          {selectedCountry && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>{selectedCountry.flag_emoji}</span>
                  <span>{selectedCountry.country_name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedCountry.user_count.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Total Users</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {selectedCountry.active_users.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Active Users</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.round(selectedCountry.avg_xp).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Avg XP</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="countries" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Countries by Users</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={countryChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Country List */}
          <Card>
            <CardHeader>
              <CardTitle>All Countries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topCountries.map((country, index) => (
                  <div
                    key={country.country_code}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedCountry(country)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{country.flag_emoji}</span>
                      <div>
                        <p className="font-medium">{country.country_name}</p>
                        <p className="text-sm text-gray-600">
                          {country.user_count} users • {country.active_users} active
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{Math.round(country.avg_xp)} XP</p>
                      <p className="text-sm text-gray-600">
                        {((country.active_users / country.user_count) * 100).toFixed(1)}% active
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Average XP by Country</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={countryChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${Number(value).toFixed(0)} XP`} />
                  <Bar dataKey="avgXp" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Engagement Rate by Country</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={countryChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                  <Line
                    type="monotone"
                    dataKey="engagementRate"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GeographicAnalytics;
