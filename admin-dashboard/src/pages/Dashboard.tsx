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
  BarChart3
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import BookingManagement from "@/components/BookingManagement.tsx";
import UserAnalytics from "@/components/UserAnalytics.tsx";
import SessionManagement from "@/components/SessionManagement.tsx";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-600">Manage your Web3 Academy platform</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-slate-600">Welcome back,</p>
              <p className="font-semibold text-slate-900">{user?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Real-time stats will be loaded here */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Total Bookings</p>
                      <p className="text-2xl font-bold text-slate-900">Loading...</p>
                    </div>
                    <Calendar className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Pending Reviews</p>
                      <p className="text-2xl font-bold text-slate-900">Loading...</p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-slate-900">Loading...</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Active Users</p>
                      <p className="text-2xl font-bold text-slate-900">Loading...</p>
                    </div>
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => setActiveTab("bookings")}
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <Calendar className="w-6 h-6" />
                    <span>Manage Bookings</span>
                  </Button>

                  <Button
                    onClick={() => setActiveTab("analytics")}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <BarChart3 className="w-6 h-6" />
                    <span>View Analytics</span>
                  </Button>

                  <Button
                    onClick={() => setActiveTab("sessions")}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <Video className="w-6 h-6" />
                    <span>Create Sessions</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <BookingManagement />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <UserAnalytics />
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <SessionManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
