import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  BellOff, 
  MessageSquare, 
  Users, 
  Heart, 
  Trophy, 
  BookOpen,
  Settings,
  Check,
  X,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { pushNotificationService } from '@/services/pushNotificationService';
import { notificationListener } from '@/services/notificationListener';

interface NotificationPreferences {
  messages: boolean;
  follows: boolean;
  reactions: boolean;
  achievements: boolean;
  course_reminders: boolean;
  push_enabled: boolean;
}

const NotificationSettings: React.FC = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    messages: true,
    follows: true,
    reactions: true,
    achievements: true,
    course_reminders: true,
    push_enabled: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'default' | 'granted' | 'denied'>('default');

  useEffect(() => {
    if (user) {
      loadPreferences();
      checkNotificationPermission();
    }
  }, [user]);

  const loadPreferences = async () => {
    try {
      const { data } = await supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (data) {
        setPreferences({
          messages: data.messages ?? true,
          follows: data.follows ?? true,
          reactions: data.reactions ?? true,
          achievements: data.achievements ?? true,
          course_reminders: data.course_reminders ?? true,
          push_enabled: data.push_enabled ?? false
        });
      }
    } catch (error) {
      console.log('No existing preferences found, using defaults');
    } finally {
      setLoading(false);
    }
  };

  const checkNotificationPermission = async () => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      
      if (permission === 'granted') {
        // Initialize push notification service
        await pushNotificationService.initialize();
        await pushNotificationService.requestPermission();
        
        // Initialize notification listener
        if (user) {
          await notificationListener.initialize(user.id);
        }
        
        // Update preferences
        const newPreferences = { ...preferences, push_enabled: true };
        setPreferences(newPreferences);
        await savePreferences(newPreferences);
        
        // Send test notification
        await notificationListener.sendTestNotification();
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const savePreferences = async (newPreferences: NotificationPreferences) => {
    if (!user) return;

    setSaving(true);
    try {
      await supabase
        .from('user_notification_preferences')
        .upsert({
          user_id: user.id,
          ...newPreferences,
          updated_at: new Date().toISOString()
        });
      
      console.log('✅ Notification preferences saved');
    } catch (error) {
      console.error('❌ Error saving preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePreferenceChange = async (key: keyof NotificationPreferences, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    await savePreferences(newPreferences);
  };

  const disablePushNotifications = async () => {
    const newPreferences = { ...preferences, push_enabled: false };
    setPreferences(newPreferences);
    await savePreferences(newPreferences);
    await notificationListener.cleanup();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Push Notification Setup */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Push Notifications
              </h3>
              <p className="text-sm text-gray-600">
                Get notified even when you're not using the app
              </p>
            </div>
            <Badge variant={permissionStatus === 'granted' ? 'default' : 'secondary'}>
              {permissionStatus === 'granted' ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>

          {permissionStatus === 'default' && (
            <Button onClick={requestNotificationPermission} className="w-full">
              <Bell className="w-4 h-4 mr-2" />
              Enable Push Notifications
            </Button>
          )}

          {permissionStatus === 'denied' && (
            <div className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">
                Notifications are blocked. Please enable them in your browser settings.
              </span>
            </div>
          )}

          {permissionStatus === 'granted' && preferences.push_enabled && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-600">
                <Check className="w-4 h-4" />
                <span className="text-sm">Push notifications are active</span>
              </div>
              <Button variant="outline" size="sm" onClick={disablePushNotifications}>
                <BellOff className="w-4 h-4 mr-2" />
                Disable
              </Button>
            </div>
          )}
        </div>

        {/* Notification Type Preferences */}
        <div className="space-y-4">
          <h3 className="font-semibold">Notification Types</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="font-medium">Messages</p>
                  <p className="text-sm text-gray-600">New direct messages</p>
                </div>
              </div>
              <Switch
                checked={preferences.messages}
                onCheckedChange={(checked) => handlePreferenceChange('messages', checked)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-green-600" />
                <div>
                  <p className="font-medium">Follows</p>
                  <p className="text-sm text-gray-600">New followers</p>
                </div>
              </div>
              <Switch
                checked={preferences.follows}
                onCheckedChange={(checked) => handlePreferenceChange('follows', checked)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-red-600" />
                <div>
                  <p className="font-medium">Reactions</p>
                  <p className="text-sm text-gray-600">Likes and reactions on your content</p>
                </div>
              </div>
              <Switch
                checked={preferences.reactions}
                onCheckedChange={(checked) => handlePreferenceChange('reactions', checked)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-4 h-4 text-yellow-600" />
                <div>
                  <p className="font-medium">Achievements</p>
                  <p className="text-sm text-gray-600">Course completions and milestones</p>
                </div>
              </div>
              <Switch
                checked={preferences.achievements}
                onCheckedChange={(checked) => handlePreferenceChange('achievements', checked)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-purple-600" />
                <div>
                  <p className="font-medium">Course Reminders</p>
                  <p className="text-sm text-gray-600">Reminders to continue learning</p>
                </div>
              </div>
              <Switch
                checked={preferences.course_reminders}
                onCheckedChange={(checked) => handlePreferenceChange('course_reminders', checked)}
                disabled={saving}
              />
            </div>
          </div>
        </div>

        {/* Test Notification */}
        {permissionStatus === 'granted' && preferences.push_enabled && (
          <div className="border-t pt-4">
            <Button
              variant="outline"
              onClick={() => notificationListener.sendTestNotification()}
              className="w-full"
            >
              <Bell className="w-4 h-4 mr-2" />
              Send Test Notification
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
