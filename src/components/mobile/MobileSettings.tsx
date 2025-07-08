import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  User,
  Shield,
  Palette,
  ChevronRight,
  Save,
  AlertTriangle,
  ArrowLeft,
  Trash2,
  Download,
  Globe,
  Bell
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useUserSettings, useUpdateUserSettings } from "@/hooks/useUserSettings";
import { useToast } from "@/components/ui/use-toast";
import { getDisplayName, getUserInitials } from "@/utils/userDisplay";
import BottomNavigation from "./BottomNavigation";
import MobileHeader from "./MobileHeader";
import PWALayout from "./PWALayout";
import PWAContentWrapper from "./PWAContentWrapper";
import MobileNotificationSettings from "./MobileNotificationSettings";

type SettingsView = 'main' | 'notifications' | 'preferences' | 'privacy';

const MobileSettings = () => {
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const { data: userSettings } = useUserSettings();
  const { toast } = useToast();
  const updateProfile = useUpdateProfile();
  const updateSettings = useUpdateUserSettings();

  const [currentView, setCurrentView] = useState<SettingsView>('main');

  const [profileData, setProfileData] = useState({
    username: profile?.username || '',
    full_name: profile?.full_name || '',
    email: profile?.email || user?.email || '',
    phone: profile?.phone || '',
  });

  const [settings, setSettings] = useState({
    language: 'en',
    timezone: '',
    show_progress: true,
    show_achievements: true,
    data_analytics: true,
  });

  // Update local state when userSettings loads
  useEffect(() => {
    if (userSettings) {
      setSettings({
        language: userSettings.language,
        timezone: userSettings.timezone || '',
        show_progress: userSettings.show_progress,
        show_achievements: userSettings.show_achievements,
        data_analytics: userSettings.data_analytics,
      });
    }
  }, [userSettings]);

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

  const handleSettingsSave = async () => {
    try {
      await updateSettings.mutateAsync(settings);
      toast({
        title: "Settings Updated",
        description: "Your preferences have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExportData = () => {
    toast({
      title: "Data Export",
      description: "Your data export will be emailed to you within 24 hours.",
    });
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
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage notification preferences',
      icon: Bell,
      view: 'notifications' as SettingsView,
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Language and regional settings',
      icon: Globe,
      view: 'preferences' as SettingsView,
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

  const renderNotificationsView = () => (
    <MobileNotificationSettings />
  );

  const renderPreferencesView = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>General Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Language</Label>
            <Select
              value={settings.language}
              onValueChange={(value) =>
                setSettings(prev => ({ ...prev, language: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish (Coming Soon)</SelectItem>
                <SelectItem value="fr">French (Coming Soon)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Timezone</Label>
            <Select
              value={settings.timezone}
              onValueChange={(value) =>
                setSettings(prev => ({ ...prev, timezone: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="America/New_York">Eastern Time</SelectItem>
                <SelectItem value="America/Chicago">Central Time</SelectItem>
                <SelectItem value="America/Denver">Mountain Time</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                <SelectItem value="Europe/London">London</SelectItem>
                <SelectItem value="Europe/Paris">Paris</SelectItem>
                <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleSettingsSave}
            disabled={updateSettings.isPending}
            className="w-full"
          >
            <Save className="h-4 w-4 mr-2" />
            {updateSettings.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
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
              checked={settings.show_progress}
              onCheckedChange={(checked) =>
                setSettings(prev => ({ ...prev, show_progress: checked }))
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
              checked={settings.show_achievements}
              onCheckedChange={(checked) =>
                setSettings(prev => ({ ...prev, show_achievements: checked }))
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
              checked={settings.data_analytics}
              onCheckedChange={(checked) =>
                setSettings(prev => ({ ...prev, data_analytics: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <Button
            onClick={handleSettingsSave}
            disabled={updateSettings.isPending}
            className="w-full"
          >
            <Save className="h-4 w-4 mr-2" />
            {updateSettings.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium">Export Your Data</h4>
            <p className="text-sm text-slate-600">
              Download a copy of all your data including progress and achievements.
            </p>
            <Button
              variant="outline"
              onClick={handleExportData}
              className="w-full mt-2"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
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
      case 'notifications':
        return renderNotificationsView();
      case 'preferences':
        return renderPreferencesView();
      case 'privacy':
        return renderPrivacyView();
      default:
        return renderMainView();
    }
  };

  return (
    <PWALayout hasHeader={true} hasBottomNav={true} className="bg-background">
      <MobileHeader
        title={currentView === 'main' ? 'Settings' :
          settingsMenuItems.find(item => item.view === currentView)?.title || 'Settings'}
        showBackButton={currentView !== 'main'}
        onBackClick={() => setCurrentView('main')}
      />

      {/* Content */}
      <PWAContentWrapper padding="md">
        {renderCurrentView()}
      </PWAContentWrapper>

      <BottomNavigation />
    </PWALayout>
  );
};

export default MobileSettings;
