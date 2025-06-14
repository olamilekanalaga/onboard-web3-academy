import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  Shield,
  Palette,
  Trash2,
  AlertTriangle,
  Settings as SettingsIcon
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/components/ui/use-toast";
import ThemeToggle from "@/components/ThemeToggle";
import Header from "@/components/Header";

const Settings = () => {
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const { toast } = useToast();

  const [notifications, setNotifications] = useState({
    email_notifications: true,
    push_notifications: true,
    course_reminders: true,
    achievement_alerts: true,
    marketing_emails: false,
  });

  const [privacy, setPrivacy] = useState({
    profile_visibility: 'public',
    show_progress: true,
    show_achievements: true,
    data_analytics: true,
  });

  const handleDeleteAccount = async () => {
    // This would typically show a confirmation dialog
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast({
        title: "Account Deletion",
        description: "Please contact support to delete your account.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <SettingsIcon className="h-8 w-8 text-emerald-600" />
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span>Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Privacy</span>
            </TabsTrigger>
          </TabsList>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you want to be notified about updates and activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
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
                    <div className="space-y-0.5">
                      <Label>Course Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Get reminded about incomplete courses
                      </p>
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
                    <div className="space-y-0.5">
                      <Label>Achievement Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Celebrate your achievements with notifications
                      </p>
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
                    <div className="space-y-0.5">
                      <Label>Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about new features and courses
                      </p>
                    </div>
                    <Switch
                      checked={notifications.marketing_emails}
                      onCheckedChange={(checked) =>
                        setNotifications(prev => ({ ...prev, marketing_emails: checked }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize how the application looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="capitalize">
                        Light Mode
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Currently using light theme
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy & Security</CardTitle>
                <CardDescription>
                  Control your privacy settings and data usage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Learning Progress</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow others to see your course progress
                      </p>
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
                    <div className="space-y-0.5">
                      <Label>Show Achievements</Label>
                      <p className="text-sm text-muted-foreground">
                        Display your achievements on your profile
                      </p>
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
                    <div className="space-y-0.5">
                      <Label>Analytics & Insights</Label>
                      <p className="text-sm text-muted-foreground">
                        Help us improve by sharing anonymous usage data
                      </p>
                    </div>
                    <Switch
                      checked={privacy.data_analytics}
                      onCheckedChange={(checked) =>
                        setPrivacy(prev => ({ ...prev, data_analytics: checked }))
                      }
                    />
                  </div>
                </div>

                <Separator />

                {/* Danger Zone */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
                  </div>
                  <Card className="border-destructive">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Delete Account</h4>
                          <p className="text-sm text-muted-foreground">
                            Permanently delete your account and all associated data. This action cannot be undone.
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          onClick={handleDeleteAccount}
                          className="w-full sm:w-auto"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Account
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
