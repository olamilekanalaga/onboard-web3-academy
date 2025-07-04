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
  Filter,
  RefreshCw
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
  Line,
  Legend
} from 'recharts';
// import { motion } from 'framer-motion'; // Temporarily disabled
import { adminDataService } from '@/services/adminDataService';

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

const COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FFEAA7', // Yellow
  '#DDA0DD', // Plum
  '#98D8C8', // Mint
  '#F7DC6F', // Light Yellow
  '#BB8FCE', // Light Purple
  '#85C1E9', // Light Blue
  '#F8C471', // Orange
  '#82E0AA', // Light Green
  '#F1948A', // Pink
  '#AED6F1', // Sky Blue
  '#D7BDE2'  // Lavender
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
  
  const [countryStats, setCountryStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadGeographicData = async () => {
    setIsLoading(true);
    try {
      console.log('🌍 Loading geographic data from centralized service...');

      const analytics = await adminDataService.getComprehensiveUserAnalytics();

      // Convert to expected format for this component
      const processedStats = analytics.countryStats.map(country => ({
        country_name: country.country_name,
        country_code: country.country_code,
        flag_emoji: '🌍', // Default flag
        user_count: country.user_count,
        active_users: country.active_users,
        avg_xp: Math.floor(Math.random() * 1000) + 500 // Simulated XP for now
      }));

      setCountryStats(processedStats);
      console.log('✅ Loaded geographic data:', processedStats.length, 'countries');

    } catch (error) {
      console.error('❌ Error in loadGeographicData:', error);
      setCountryStats([]);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadGeographicData();
  }, []);

  const handleRefresh = async () => {
    await adminDataService.refreshData();
    await loadGeographicData();
  };

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
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
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
              <div className="w-full h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-4">
                <div className="h-full relative overflow-hidden rounded-lg bg-white shadow-inner">
                  {/* SVG World Map */}
                  <svg
                    viewBox="0 0 1000 500"
                    className="w-full h-full"
                    style={{ background: 'linear-gradient(to bottom, #e0f2fe 0%, #b3e5fc 100%)' }}
                  >
                    {/* Simplified world map paths */}
                    <g fill="#94a3b8" stroke="#64748b" strokeWidth="0.5">
                      {/* North America */}
                      <path d="M150 150 L250 140 L280 180 L250 220 L180 230 L120 200 Z" />
                      {/* South America */}
                      <path d="M200 250 L240 240 L260 300 L240 380 L200 390 L180 320 Z" />
                      {/* Europe */}
                      <path d="M450 120 L520 110 L540 150 L500 170 L440 160 Z" />
                      {/* Africa */}
                      <path d="M480 180 L540 170 L560 280 L520 350 L480 340 L460 250 Z" />
                      {/* Asia */}
                      <path d="M550 100 L750 90 L800 150 L780 200 L720 220 L650 180 L580 140 Z" />
                      {/* Australia */}
                      <path d="M720 280 L780 275 L790 310 L760 320 L720 315 Z" />
                    </g>

                    {/* User distribution dots */}
                    {topCountries.slice(0, 10).map((country, index) => {
                      // Simple positioning based on country codes
                      const positions: Record<string, {x: number, y: number}> = {
                        'US': {x: 200, y: 180},
                        'GB': {x: 480, y: 140},
                        'CA': {x: 180, y: 160},
                        'AU': {x: 750, y: 300},
                        'DE': {x: 500, y: 130},
                        'FR': {x: 470, y: 150},
                        'IN': {x: 650, y: 180},
                        'BR': {x: 220, y: 280},
                        'JP': {x: 780, y: 160},
                        'CN': {x: 700, y: 150},
                        'NG': {x: 500, y: 220},
                        'ZA': {x: 520, y: 320},
                        'MX': {x: 160, y: 220},
                        'IT': {x: 490, y: 160},
                        'ES': {x: 450, y: 170}
                      };

                      const pos = positions[country.country_code] || {x: 500 + (index * 30), y: 250};
                      const size = Math.max(4, Math.min(20, country.user_count / 3));

                      return (
                        <g key={country.country_code}>
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r={size}
                            fill="#3b82f6"
                            fillOpacity="0.8"
                            stroke="#1d4ed8"
                            strokeWidth="2"
                            className="hover:fill-blue-600 cursor-pointer"
                          />
                          <text
                            x={pos.x}
                            y={pos.y - size - 8}
                            textAnchor="middle"
                            fontSize="12"
                            fill="#1e293b"
                            fontWeight="bold"
                            className="pointer-events-none"
                          >
                            {country.flag_emoji}
                          </text>
                          <text
                            x={pos.x}
                            y={pos.y + size + 15}
                            textAnchor="middle"
                            fontSize="10"
                            fill="#475569"
                            fontWeight="600"
                            className="pointer-events-none"
                          >
                            {country.user_count}
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 rounded-lg p-4 shadow-lg border">
                    <h4 className="font-semibold text-sm mb-3 text-gray-800">Global Distribution</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-blue-700"></div>
                        <span className="text-gray-700">Users per country</span>
                      </div>
                      <div className="text-gray-600 pl-6">
                        <div>Total Users: <span className="font-semibold">{topCountries.reduce((sum, c) => sum + c.user_count, 0)}</span></div>
                        <div>Countries: <span className="font-semibold">{countryStats.length}</span></div>
                        <div>Avg XP: <span className="font-semibold">{Math.round(topCountries.reduce((sum, c) => sum + c.avg_xp, 0) / topCountries.length)}</span></div>
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
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} users`, name]} />
                    <Legend />
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
