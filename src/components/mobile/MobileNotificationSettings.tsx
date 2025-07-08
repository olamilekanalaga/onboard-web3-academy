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
  Check,
  X,
  AlertCircle,
  ArrowLeft
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

const MobileNotificationSettings: React.FC = () => {
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
        await pushNotificationService.initialize();

        if (user) {
          // Subscribe to push notifications
          const subscribed = await pushNotificationService.subscribe(user.id);
          if (subscribed) {
            console.log('✅ Successfully subscribed to push notifications');

            // Initialize notification listener
            await notificationListener.initialize(user.id);

            // Update preferences
            const newPreferences = { ...preferences, push_enabled: true };
            setPreferences(newPreferences);
            await savePreferences(newPreferences);

            // Send test notification
            await notificationListener.sendTestNotification();
          } else {
            console.error('❌ Failed to subscribe to push notifications');
          }
        }
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
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {/* Push Notification Setup */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Push Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Push Notifications</p>
              <p className="text-sm text-gray-600">
                Get notified when you're not using the app
              </p>
            </div>
            <Badge variant={permissionStatus === 'granted' ? 'default' : 'secondary'}>
              {permissionStatus === 'granted' ? 'On' : 'Off'}
            </Badge>
          </div>

          {permissionStatus === 'default' && (
            <Button onClick={requestNotificationPermission} className="w-full">
              <Bell className="w-4 h-4 mr-2" />
              Enable Push Notifications
            </Button>
          )}

          {permissionStatus === 'denied' && (
            <div className="flex items-start gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium">Notifications Blocked</p>
                <p>Please enable notifications in your browser settings to receive push notifications.</p>
              </div>
            </div>
          )}

          {permissionStatus === 'granted' && preferences.push_enabled && (
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-700">
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-medium">Push notifications active</span>
                </div>
                <Button variant="outline" size="sm" onClick={disablePushNotifications}>
                  <BellOff className="w-4 h-4 mr-2" />
                  Disable
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Notification Types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                </div>
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
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-green-600" />
                </div>
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
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">Reactions</p>
                  <p className="text-sm text-gray-600">Likes and reactions</p>
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
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium">Achievements</p>
                  <p className="text-sm text-gray-600">Course completions</p>
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
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Course Reminders</p>
                  <p className="text-sm text-gray-600">Learning reminders</p>
                </div>
              </div>
              <Switch
                checked={preferences.course_reminders}
                onCheckedChange={(checked) => handlePreferenceChange('course_reminders', checked)}
                disabled={saving}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Notification */}
      {permissionStatus === 'granted' && preferences.push_enabled && (
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6 space-y-3">
            <Button
              variant="outline"
              onClick={() => notificationListener.sendTestNotification()}
              className="w-full"
            >
              <Bell className="w-4 h-4 mr-2" />
              Send In-App Test
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                const success = await pushNotificationService.sendTestPushNotification(
                  'Academia Test',
                  'This is a test push notification! 🔔'
                );
                if (success) {
                  console.log('✅ Test push notification sent');
                } else {
                  console.error('❌ Failed to send test push notification');
                }
              }}
              className="w-full bg-blue-50 border-blue-200 text-blue-700"
            >
              <Bell className="w-4 h-4 mr-2" />
              Send Push Test
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MobileNotificationSettings;
