import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  TrendingUp,
  Globe,
  BookOpen,
  Award,
  Clock,
  DollarSign,
  Activity,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  BarChart3,
  PieChart,
  LineChart,
  FileText,
  FileSpreadsheet
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
// import { motion } from 'framer-motion'; // Temporarily disabled
import {
  useComprehensiveUserAnalytics,
  useUserGrowthAnalytics,
  useUserProgressAnalytics,
  useCourseCompletionAnalytics,
  useEnhancedUserCountryStats
} from '@/hooks/useAdminData';
import {
  exportToExcel,
  exportToPDF,
  formatAnalyticsDataForExport,
  generateComprehensivePDFReport,
  generateComprehensiveExcelReport
} from '@/utils/dataExport';

// Enhanced color palette with better contrast and visibility
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

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  loading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  loading = false
}) => (
  <div>
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className="text-blue-600">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">
          {loading ? (
            <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            value
          )}
        </div>
        {change && (
          <p className={`text-xs mt-1 ${
            changeType === 'positive' ? 'text-green-600' : 
            changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  </div>
);

const EnhancedAnalyticsDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [showFilters, setShowFilters] = useState(false);

  // Data hooks
  const { data: comprehensiveStats, isLoading: statsLoading, refetch: refetchStats } = useComprehensiveUserAnalytics();
  const { data: growthData, isLoading: growthLoading } = useUserGrowthAnalytics(selectedPeriod);
  const { data: userProgress, isLoading: progressLoading } = useUserProgressAnalytics();
  const { data: courseStats, isLoading: courseLoading } = useCourseCompletionAnalytics();
  const { data: countryStats, isLoading: countryLoading } = useEnhancedUserCountryStats();

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchStats();
    setRefreshing(false);
  };

  const handleExportAnalyticsPDF = () => {
    if (!comprehensiveStats) {
      alert('No analytics data to export');
      return;
    }

    const exportData = formatAnalyticsDataForExport(comprehensiveStats);
    const timestamp = new Date().toISOString().split('T')[0];
    exportToPDF(exportData, `analytics-report-${timestamp}`, 'Analytics Dashboard Report');
  };

  const handleExportAnalyticsExcel = () => {
    if (!comprehensiveStats) {
      alert('No analytics data to export');
      return;
    }

    const exportData = formatAnalyticsDataForExport(comprehensiveStats);
    const timestamp = new Date().toISOString().split('T')[0];
    exportToExcel(exportData, `analytics-report-${timestamp}`, 'Analytics');
  };

  const handleExportComprehensivePDF = async () => {
    const data = {
      analytics: comprehensiveStats,
      countries: countryStats?.countries,
      courses: courseStats
    };

    await generateComprehensivePDFReport(data);
  };

  const handleExportComprehensiveExcel = async () => {
    const data = {
      analytics: comprehensiveStats,
      countries: countryStats?.countries,
      courses: courseStats
    };

    await generateComprehensiveExcelReport(data);
  };

  // Prepare chart data
  const userGrowthChartData = growthData?.slice(0, 30).reverse().map(item => ({
    date: new Date(item.period_date).toLocaleDateString(),
    newUsers: item.new_users,
    activeUsers: item.active_users,
    cumulativeUsers: item.cumulative_users
  })) || [];

  const topCountriesData = countryStats?.countries?.slice(0, 10).map(country => ({
    name: country.country_name,
    users: country.user_count,
    avg_xp: country.avg_xp || 0
  })) || [];

  const courseCompletionData = courseStats?.map(course => ({
    name: course.course_name,
    completions: course.total_completions,
    rate: course.completion_rate
  })) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive platform insights and metrics</p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          {/* Control Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          </div>

          {/* Export Buttons */}
          <div className="flex gap-2">
            <div className="text-xs text-gray-500 self-center mr-2">Quick Export:</div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportAnalyticsPDF}
              disabled={!comprehensiveStats}
              className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
            >
              <FileText className="w-4 h-4" />
              <span>PDF</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportAnalyticsExcel}
              disabled={!comprehensiveStats}
              className="flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Excel</span>
            </Button>
          </div>

          {/* Comprehensive Export */}
          <div className="flex gap-2">
            <div className="text-xs text-gray-500 self-center mr-2">Full Report:</div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportComprehensivePDF}
              disabled={!comprehensiveStats}
              className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
            >
              <FileText className="w-4 h-4" />
              <span>Complete PDF</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportComprehensiveExcel}
              disabled={!comprehensiveStats}
              className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Complete Excel</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Analytics Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Time Period
                </label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as 'daily' | 'weekly' | 'monthly')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="daily">Daily View</option>
                  <option value="weekly">Weekly View</option>
                  <option value="monthly">Monthly View</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Date Range
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as '7d' | '30d' | '90d' | '1y')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedPeriod('daily');
                    setDateRange('30d');
                  }}
                  className="w-full flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset
                </Button>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={() => setShowFilters(false)}
                  className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Eye className="w-4 h-4" />
                  Apply & Close
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Key Performance Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={comprehensiveStats?.total_users?.toLocaleString() || '0'}
          change="+12% from last month"
          changeType="positive"
          icon={<Users className="w-5 h-5" />}
          loading={statsLoading}
        />
        <MetricCard
          title="Active Users (30d)"
          value={comprehensiveStats?.active_users_month?.toLocaleString() || '0'}
          change="+8% from last month"
          changeType="positive"
          icon={<Activity className="w-5 h-5" />}
          loading={statsLoading}
        />
        <MetricCard
          title="Course Completions"
          value={comprehensiveStats?.total_course_completions?.toLocaleString() || '0'}
          change="+15% from last month"
          changeType="positive"
          icon={<BookOpen className="w-5 h-5" />}
          loading={statsLoading}
        />
        <MetricCard
          title="Total XP Earned"
          value={comprehensiveStats?.total_xp_earned?.toLocaleString() || '0'}
          change="+22% from last month"
          changeType="positive"
          icon={<Award className="w-5 h-5" />}
          loading={statsLoading}
        />
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <PieChart className="w-5 h-5" />
          Detailed Analytics
        </h2>
        <Tabs defaultValue="growth" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="growth">User Growth</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="courses">Course Analytics</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>User Growth Trends</CardTitle>
                <div className="flex space-x-2">
                  {(['daily', 'weekly', 'monthly'] as const).map((period) => (
                    <Button
                      key={period}
                      variant={selectedPeriod === period ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedPeriod(period)}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={userGrowthChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="newUsers"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                    name="New Users"
                  />
                  <Area
                    type="monotone"
                    dataKey="activeUsers"
                    stackId="1"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    name="Active Users"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Countries by Users</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topCountriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Distribution by Country</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RechartsPieChart>
                    <Pie
                      data={topCountriesData}
                      cx="50%"
                      cy="45%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        percent > 0.05 ? `${name} ${(percent * 100).toFixed(1)}%` : ''
                      }
                      outerRadius={100}
                      innerRadius={40}
                      fill="#8884d8"
                      dataKey="users"
                      stroke="#ffffff"
                      strokeWidth={2}
                    >
                      {topCountriesData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value} users`, 'Users']}
                      labelFormatter={(label) => `Country: ${label}`}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value, entry) => (
                        <span style={{ color: entry.color, fontWeight: 500 }}>
                          {value}
                        </span>
                      )}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Completion Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={courseCompletionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completions" fill="#8884d8" name="Completions" />
                  <Bar dataKey="rate" fill="#82ca9d" name="Completion Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricCard
              title="Avg Session Duration"
              value={`${Math.round(comprehensiveStats?.avg_session_duration || 0)} min`}
              change="+5% from last week"
              changeType="positive"
              icon={<Clock className="w-5 h-5" />}
              loading={statsLoading}
            />
            <MetricCard
              title="Daily Active Users"
              value={comprehensiveStats?.active_users_today?.toLocaleString() || '0'}
              change="+3% from yesterday"
              changeType="positive"
              icon={<Users className="w-5 h-5" />}
              loading={statsLoading}
            />
          </div>
        </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedAnalyticsDashboard;
