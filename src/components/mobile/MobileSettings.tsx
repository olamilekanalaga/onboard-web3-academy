import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Bell,
  Shield,
  Palette,
  ChevronRight,
  Save,
  AlertTriangle,
  ArrowLeft,
  Trash2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/components/ui/use-toast";
import { getDisplayName, getUserInitials } from "@/utils/userDisplay";
import ThemeToggle from "../ThemeToggle";
import BottomNavigation from "./BottomNavigation";

type SettingsView = 'main' | 'profile' | 'notifications' | 'appearance' | 'privacy';

const MobileSettings = () => {
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const { theme } = useTheme();
  const { toast } = useToast();
  const updateProfile = useUpdateProfile();

  const [currentView, setCurrentView] = useState<SettingsView>('main');

  const [profileData, setProfileData] = useState({
    username: profile?.username || '',
    full_name: profile?.full_name || '',
    email: profile?.email || user?.email || '',
    phone: profile?.phone || '',
  });

  const [notifications, setNotifications] = useState({
    email_notifications: true,
    course_reminders: true,
    achievement_alerts: true,
    marketing_emails: false,
  });

  const [privacy, setPrivacy] = useState({
    show_progress: true,
    show_achievements: true,
    data_analytics: true,
  });

  const handleProfileSave = async () => {
    try {
      await updateProfile.mutateAsync({
        username: profileData.username,
        full_name: profileData.full_name,
        phone: profileData.phone,
      });
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast({
        title: "Account Deletion",
        description: "Please contact support to delete your account.",
        variant: "destructive",
      });
    }
  };

  const settingsMenuItems = [
    {
      id: 'profile',
      title: 'Profile',
      description: 'Manage your personal information',
      icon: User,
      view: 'profile' as SettingsView,
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Control your notification preferences',
      icon: Bell,
      view: 'notifications' as SettingsView,
    },
    {
      id: 'appearance',
      title: 'Appearance',
      description: 'Customize theme and display',
      icon: Palette,
      view: 'appearance' as SettingsView,
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      description: 'Manage privacy settings',
      icon: Shield,
      view: 'privacy' as SettingsView,
    },
  ];

  const renderMainView = () => (
    <div className="space-y-6">
      {/* User Profile Card */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {getUserInitials(profile, user)}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900">
                {getDisplayName(profile, user)}
              </h3>
              <p className="text-sm text-slate-600">{user?.email}</p>
              <Badge variant="secondary" className="mt-1">
                Level 1 • Beginner
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Menu */}
      <div className="space-y-2">
        {settingsMenuItems.map((item) => (
          <Card
            key={item.id}
            className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setCurrentView(item.view)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">{item.title}</h4>
                    <p className="text-sm text-slate-600">{item.description}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sign Out Button */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <Button
            variant="outline"
            className="w-full text-red-600 border-red-200 hover:bg-red-50"
            onClick={signOut}
          >
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderProfileView = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={profileData.username}
              onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
              placeholder="Enter username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={profileData.full_name}
              onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
              placeholder="Enter full name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profileData.email}
              disabled
              className="bg-slate-50"
            />
            <p className="text-xs text-slate-500">
              Email cannot be changed. Contact support if needed.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={profileData.phone}
              onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Enter phone number"
            />
          </div>
          <Button onClick={handleProfileSave} disabled={updateProfile.isPending} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationsView = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-slate-600">Receive notifications via email</p>
            </div>
            <Switch
              checked={notifications.email_notifications}
              onCheckedChange={(checked) =>
                setNotifications(prev => ({ ...prev, email_notifications: checked }))
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Course Reminders</Label>
              <p className="text-sm text-slate-600">Get reminded about incomplete courses</p>
            </div>
            <Switch
              checked={notifications.course_reminders}
              onCheckedChange={(checked) =>
                setNotifications(prev => ({ ...prev, course_reminders: checked }))
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Achievement Alerts</Label>
              <p className="text-sm text-slate-600">Celebrate achievements with notifications</p>
            </div>
            <Switch
              checked={notifications.achievement_alerts}
              onCheckedChange={(checked) =>
                setNotifications(prev => ({ ...prev, achievement_alerts: checked }))
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Marketing Emails</Label>
              <p className="text-sm text-slate-600">Updates about new features and courses</p>
            </div>
            <Switch
              checked={notifications.marketing_emails}
              onCheckedChange={(checked) =>
                setNotifications(prev => ({ ...prev, marketing_emails: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAppearanceView = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Appearance Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Theme</Label>
              <p className="text-sm text-slate-600">Choose your preferred theme</p>
            </div>
            <ThemeToggle showLabel />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>Current Theme</Label>
            <Badge variant="secondary" className="capitalize">
              {theme}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPrivacyView = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Privacy & Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Show Learning Progress</Label>
              <p className="text-sm text-slate-600">Allow others to see your progress</p>
            </div>
            <Switch
              checked={privacy.show_progress}
              onCheckedChange={(checked) =>
                setPrivacy(prev => ({ ...prev, show_progress: checked }))
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Show Achievements</Label>
              <p className="text-sm text-slate-600">Display achievements on your profile</p>
            </div>
            <Switch
              checked={privacy.show_achievements}
              onCheckedChange={(checked) =>
                setPrivacy(prev => ({ ...prev, show_achievements: checked }))
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Analytics & Insights</Label>
              <p className="text-sm text-slate-600">Help us improve with anonymous data</p>
            </div>
            <Switch
              checked={privacy.data_analytics}
              onCheckedChange={(checked) =>
                setPrivacy(prev => ({ ...prev, data_analytics: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Delete Account</h4>
              <p className="text-sm text-slate-600">
                Permanently delete your account and all data. This cannot be undone.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'profile':
        return renderProfileView();
      case 'notifications':
        return renderNotificationsView();
      case 'appearance':
        return renderAppearanceView();
      case 'privacy':
        return renderPrivacyView();
      default:
        return renderMainView();
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 to-blue-700 px-6 pt-12 pb-6">
        <div className="flex items-center space-x-4">
          {currentView !== 'main' && (
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2"
              onClick={() => setCurrentView('main')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-white">
              {currentView === 'main' ? 'Settings' :
                settingsMenuItems.find(item => item.view === currentView)?.title || 'Settings'}
            </h1>
            <p className="text-emerald-100">
              {currentView === 'main' ? 'Manage your account' : 'Configure your preferences'}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {renderCurrentView()}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MobileSettings;
