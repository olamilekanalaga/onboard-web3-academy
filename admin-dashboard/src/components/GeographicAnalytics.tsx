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
// Removed react-simple-maps - using better visualization
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
  Line,
  Legend
} from 'recharts';
// import { motion } from 'framer-motion'; // Temporarily disabled
import { useEnhancedUserCountryStats } from '@/hooks/useAdminData';

// Removed geoUrl - using better visualization approach

// Enhanced color palette matching Analytics dashboard
const COLORS = [
  '#2563eb', // Blue
  '#dc2626', // Red
  '#16a34a', // Green
  '#ca8a04', // Yellow
  '#9333ea', // Purple
  '#ea580c', // Orange
  '#0891b2', // Cyan
  '#be185d', // Pink
  '#65a30d', // Lime
  '#7c2d12', // Brown
  '#374151', // Gray
  '#1e40af'  // Dark Blue
];

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
  
  const { data: countryData, isLoading } = useEnhancedUserCountryStats();

  // Process data for visualizations
  const countryStats = countryData?.countries || [];
  const topCountries = countryStats?.slice(0, 10) || [];

  // Get actual total users from the database (not just sum of countries)
  // This includes users without country data
  const totalUsers = countryData?.totals?.totalUsers || 0;
  const totalActiveUsers = countryData?.totals?.totalActiveUsers || 0;

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

  // Removed getCountryColor function - no longer needed without map

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
                <p className="text-2xl font-bold">{countryData?.totals?.totalCountries || 0}</p>
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
              {/* Enhanced Global User Distribution Visualization */}
              <div className="w-full h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6">
                <div className="h-full relative overflow-hidden rounded-lg bg-white shadow-inner">

                  {/* Interactive Global Grid Visualization */}
                  <div className="h-full flex flex-col">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Global User Distribution</h3>
                      <p className="text-sm text-gray-600">Interactive view of users across {countryStats.length} countries</p>
                    </div>

                    {/* World Regions Grid */}
                    <div className="flex-1 grid grid-cols-4 gap-4 p-4">

                      {/* North America */}
                      <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-4 relative overflow-hidden">
                        <div className="absolute top-2 right-2 text-2xl">🌎</div>
                        <h4 className="font-semibold text-blue-800 mb-2">North America</h4>
                        <div className="space-y-1">
                          {countryStats.filter(c => ['US', 'CA', 'MX'].includes(c.country_code)).slice(0, 3).map(country => (
                            <div key={country.country_code} className="flex items-center justify-between text-sm">
                              <span className="flex items-center space-x-1">
                                <span>{country.flag_emoji}</span>
                                <span className="font-medium">{country.country_code}</span>
                              </span>
                              <span className="font-bold text-blue-700">{country.user_count}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Europe */}
                      <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-4 relative overflow-hidden">
                        <div className="absolute top-2 right-2 text-2xl">🌍</div>
                        <h4 className="font-semibold text-green-800 mb-2">Europe</h4>
                        <div className="space-y-1">
                          {countryStats.filter(c => ['GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'SE', 'NO'].includes(c.country_code)).slice(0, 3).map(country => (
                            <div key={country.country_code} className="flex items-center justify-between text-sm">
                              <span className="flex items-center space-x-1">
                                <span>{country.flag_emoji}</span>
                                <span className="font-medium">{country.country_code}</span>
                              </span>
                              <span className="font-bold text-green-700">{country.user_count}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Asia */}
                      <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg p-4 relative overflow-hidden">
                        <div className="absolute top-2 right-2 text-2xl">🌏</div>
                        <h4 className="font-semibold text-purple-800 mb-2">Asia</h4>
                        <div className="space-y-1">
                          {countryStats.filter(c => ['IN', 'CN', 'JP', 'KR', 'SG', 'TH', 'PH'].includes(c.country_code)).slice(0, 3).map(country => (
                            <div key={country.country_code} className="flex items-center justify-between text-sm">
                              <span className="flex items-center space-x-1">
                                <span>{country.flag_emoji}</span>
                                <span className="font-medium">{country.country_code}</span>
                              </span>
                              <span className="font-bold text-purple-700">{country.user_count}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Africa & Others */}
                      <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg p-4 relative overflow-hidden">
                        <div className="absolute top-2 right-2 text-2xl">🌍</div>
                        <h4 className="font-semibold text-orange-800 mb-2">Africa & Others</h4>
                        <div className="space-y-1">
                          {countryStats.filter(c => ['NG', 'ZA', 'EG', 'KE', 'GH', 'AU', 'BR'].includes(c.country_code)).slice(0, 3).map(country => (
                            <div key={country.country_code} className="flex items-center justify-between text-sm">
                              <span className="flex items-center space-x-1">
                                <span>{country.flag_emoji}</span>
                                <span className="font-medium">{country.country_code}</span>
                              </span>
                              <span className="font-bold text-orange-700">{country.user_count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Global Stats Bar */}
                    <div className="bg-gray-50 rounded-lg p-4 mt-4">
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{totalUsers.toLocaleString()}</div>
                          <div className="text-xs text-gray-600">Total Users</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">{countryStats.length}</div>
                          <div className="text-xs text-gray-600">Countries</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">{totalActiveUsers.toLocaleString()}</div>
                          <div className="text-xs text-gray-600">Active Users</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-orange-600">{Math.round(countryStats.reduce((sum, c) => sum + c.avg_xp, 0) / countryStats.length || 0)}</div>
                          <div className="text-xs text-gray-600">Avg XP</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Top Countries Mini List */}
                  <div className="absolute top-4 right-4 bg-white bg-opacity-95 rounded-lg p-3 shadow-lg border max-w-xs">
                    <h4 className="font-semibold text-sm mb-2 text-gray-800">Top Countries</h4>
                    <div className="space-y-1 text-xs">
                      {topCountries.slice(0, 5).map((country, index) => (
                        <div key={country.country_code} className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <span>{country.flag_emoji}</span>
                            <span className="font-medium">{country.country_name}</span>
                          </div>
                          <span className="text-gray-600">{country.user_count}</span>
                        </div>
                      ))}
                    </div>
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
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="45%"
                      labelLine={false}
                      label={false}
                      outerRadius={100}
                      innerRadius={40}
                      stroke="#ffffff"
                      strokeWidth={2}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value} users`, name]}
                      contentStyle={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }}
                    />

                  </PieChart>
                </ResponsiveContainer>

                {/* Color Legend */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  {pieChartData.map((country, index) => (
                    <div key={country.name} className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: country.color }}
                      ></div>
                      <span className="truncate font-medium">{country.name}</span>
                      <span className="text-gray-500 ml-auto">({country.value})</span>
                    </div>
                  ))}
                </div>
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
