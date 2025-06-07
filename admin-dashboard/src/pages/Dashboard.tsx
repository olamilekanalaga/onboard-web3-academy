import React from 'react';
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
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
            <p className="text-xl text-slate-600">
              Manage bookings, analyze user data, and monitor platform performance
            </p>
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Bookings</p>
                <p className="text-3xl font-bold text-slate-900">156</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
                  <span className="text-sm font-medium text-green-600">+12% from last month</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-slate-900">$23,450</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
                  <span className="text-sm font-medium text-green-600">+8% from last month</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Pending Bookings</p>
                <p className="text-3xl font-bold text-slate-900">12</p>
                <div className="flex items-center mt-2">
                  <AlertCircle className="w-4 h-4 mr-1 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-600">Needs attention</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Completed Sessions</p>
                <p className="text-3xl font-bold text-slate-900">134</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
                  <span className="text-sm font-medium text-green-600">+15% from last month</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Average Rating</p>
                <p className="text-3xl font-bold text-slate-900">4.8</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
                  <span className="text-sm font-medium text-green-600">+0.2 from last month</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Global Users</p>
                <p className="text-3xl font-bold text-slate-900">2,847</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
                  <span className="text-sm font-medium text-green-600">+25% from last month</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
                <Globe className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Admin Dashboard</h2>
          <p className="text-slate-600 mb-6">
            Welcome to your admin dashboard! This is a simplified version showing key metrics.
            Full booking management, user analytics, and session controls are coming soon.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-900">Booking Management</h3>
              <p className="text-sm text-slate-600">Approve, manage, and track all session bookings</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-900">User Analytics</h3>
              <p className="text-sm text-slate-600">View user demographics and behavior insights</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-900">Session Control</h3>
              <p className="text-sm text-slate-600">Create and manage available session slots</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
