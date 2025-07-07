import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { Button } from "@/components/ui/button";
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Globe,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  LogOut,
  Eye,
  MessageSquare,
  Video,
  X,
  Filter,
  Download,
  BarChart3,
  Menu,
  Activity,
  Award,
  BookOpen
} from "lucide-react";
// import { motion } from 'framer-motion'; // Temporarily disabled
import { useAuth } from "@/contexts/AuthContext";
import UserAnalytics from "@/components/UserAnalytics.tsx";
import EnhancedAnalyticsDashboard from "@/components/EnhancedAnalyticsDashboard";
import EnhancedUserManagement from "@/components/EnhancedUserManagement";
import GeographicAnalytics from "@/components/GeographicAnalytics";
import Sidebar from "@/components/Sidebar";
// Removed UserCountTest since the app is working fine now
import RealTimeUserActivity from "@/components/RealTimeUserActivity";
import TodayGrowthChart from "@/components/TodayGrowthChart";
import NotificationsPanel from "@/components/NotificationsPanel";
import SettingsPanel from "@/components/SettingsPanel";

import { useRealUserCount, useComprehensiveUserAnalytics } from "@/hooks/useAdminData";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewDashboard />;
      case 'analytics':
        return <EnhancedAnalyticsDashboard />;
      case 'users':
        return <EnhancedUserManagement />;
      case 'geographic':
        return <GeographicAnalytics />;
      case 'courses':
        return <UserAnalytics />;
      case 'notifications':
        return <NotificationsPanel />;

      case 'settings':
        return <SettingsPanel />;
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Fixed Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-full z-30">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative flex flex-col w-80 bg-white h-full">
            <Sidebar
              activeTab={activeTab}
              onTabChange={(tab) => {
                setActiveTab(tab);
                setMobileMenuOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content with Left Margin for Fixed Sidebar */}
      <div
        className="flex-1 flex flex-col min-w-0 transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? 80 : 280 }}
      >
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 fixed top-0 left-0 right-0 z-20">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <img
                src="/academia mobile.png"
                alt="Academia Logo"
                className="h-8 w-8 object-contain"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900">Academia</span>
                <span className="text-xs text-gray-600">Admin Dashboard</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content Area with Scroll */}
        <main className="flex-1 overflow-y-auto h-screen">
          <div className="p-6 lg:pt-6 pt-20">
            <div>
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Overview Dashboard Component
const OverviewDashboard: React.FC = () => {
  const { data: userCount, isLoading: userCountLoading } = useRealUserCount();
  const { data: analytics, isLoading: analyticsLoading } = useComprehensiveUserAnalytics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome to your Academia admin dashboard</p>
        {analytics && (
          <div className="mt-2 text-sm text-blue-600">
            Live data from Supabase • {analytics.users_with_stats || 0} users have learning stats
          </div>
        )}
      </div>



      {/* Key Metrics - REAL DATA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {userCountLoading ? (
                <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                userCount?.toLocaleString() || '0'
              )}
            </div>
            <p className="text-xs text-blue-600">Live count from database</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Users (30d)</CardTitle>
            <Activity className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {analyticsLoading ? (
                <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                analytics?.active_users_month?.toLocaleString() || '0'
              )}
            </div>
            <p className="text-xs text-green-600">Users active in last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total XP Earned</CardTitle>
            <Award className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {analyticsLoading ? (
                <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                analytics?.total_xp_earned?.toLocaleString() || '0'
              )}
            </div>
            <p className="text-xs text-purple-600">Experience points earned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Course Completions</CardTitle>
            <BookOpen className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {analyticsLoading ? (
                <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                analytics?.total_course_completions?.toLocaleString() || '0'
              )}
            </div>
            <p className="text-xs text-orange-600">Total courses completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <p className="text-sm text-gray-600">Access frequently used admin functions</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center space-y-2 hover:bg-blue-50 hover:border-blue-300"
            >
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <span className="font-medium">Analytics</span>
              <span className="text-xs text-gray-500">View detailed metrics</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center space-y-2 hover:bg-green-50 hover:border-green-300"
            >
              <Users className="w-6 h-6 text-green-600" />
              <span className="font-medium">Users</span>
              <span className="text-xs text-gray-500">Manage user accounts</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center space-y-2 hover:bg-purple-50 hover:border-purple-300"
            >
              <Globe className="w-6 h-6 text-purple-600" />
              <span className="font-medium">Geographic</span>
              <span className="text-xs text-gray-500">Global user insights</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Real-Time Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RealTimeUserActivity />
        <TodayGrowthChart />

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">Healthy</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">API Services</span>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">Operational</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Storage</span>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-yellow-600">85% Used</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
