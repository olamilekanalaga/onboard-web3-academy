import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  Settings,
  Volume2,
  VolumeX,
  Trash2,
  MarkAsUnreadIcon
} from "lucide-react";
import { supabaseAdmin } from '@/lib/supabase';

interface Notification {
  id: string;
  type: 'user_registration' | 'system' | 'alert' | 'milestone';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

const NotificationsPanel: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'user_registration' | 'system'>('all');

  const generateRecentNotifications = async () => {
    try {
      // Get recent user registrations for notifications
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      const { data: recentUsers, error } = await supabaseAdmin
        .from('profiles')
        .select('username, full_name, email, created_at')
        .gte('created_at', twentyFourHoursAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Get total user count for milestones
      const { count: totalUsers } = await supabaseAdmin
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const generatedNotifications: Notification[] = [];

      // Add user registration notifications
      recentUsers?.forEach((user, index) => {
        const timeAgo = Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60));
        generatedNotifications.push({
          id: `user_${user.email}_${user.created_at}`,
          type: 'user_registration',
          title: 'New User Registration',
          message: `${user.full_name || user.username || 'Anonymous'} just joined Academia!`,
          timestamp: user.created_at,
          read: timeAgo > 60, // Mark as read if older than 1 hour
          priority: timeAgo < 30 ? 'high' : 'medium'
        });
      });

      // Add milestone notifications
      if (totalUsers && totalUsers >= 450) {
        generatedNotifications.push({
          id: 'milestone_450',
          type: 'milestone',
          title: '🎉 Milestone Reached!',
          message: `Academia has reached ${totalUsers} users! Incredible growth!`,
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'high'
        });
      }

      // Add system notifications
      generatedNotifications.push({
        id: 'system_dashboard_active',
        type: 'system',
        title: 'Admin Dashboard Active',
        message: 'Real-time monitoring is active. All systems operational.',
        timestamp: new Date().toISOString(),
        read: true,
        priority: 'low'
      });

      // Add growth alert
      const last24hCount = recentUsers?.length || 0;
      if (last24hCount > 100) {
        generatedNotifications.push({
          id: 'alert_high_growth',
          type: 'alert',
          title: '🚀 High Growth Alert',
          message: `${last24hCount} users joined in the last 24 hours! Monitor server capacity.`,
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'high'
        });
      }

      // Sort by timestamp (newest first)
      generatedNotifications.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setNotifications(generatedNotifications);
    } catch (error) {
      console.error('Error generating notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateRecentNotifications();
    
    // Refresh notifications every 2 minutes
    const interval = setInterval(generateRecentNotifications, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      );

      // Update unread count in localStorage for sidebar
      const unreadCount = updated.filter(n => !n.read).length;
      localStorage.setItem('unreadNotifications', unreadCount.toString());
      window.dispatchEvent(new Event('storage'));

      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(notif => ({ ...notif, read: true }));

      // Update unread count to 0
      localStorage.setItem('unreadNotifications', '0');
      window.dispatchEvent(new Event('storage'));

      return updated;
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    return notif.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'user_registration': return <Users className="w-4 h-4" />;
      case 'milestone': return <TrendingUp className="w-4 h-4" />;
      case 'alert': return <AlertCircle className="w-4 h-4" />;
      case 'system': return <Settings className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'high') return 'border-l-red-500 bg-red-50';
    if (type === 'milestone') return 'border-l-green-500 bg-green-50';
    if (type === 'user_registration') return 'border-l-blue-500 bg-blue-50';
    if (type === 'alert') return 'border-l-orange-500 bg-orange-50';
    return 'border-l-gray-500 bg-gray-50';
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Bell className="w-6 h-6" />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">{unreadCount}</Badge>
            )}
          </h2>
          <p className="text-gray-600">Stay updated with Academia platform activity</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Tabs value={filter} onValueChange={(value: any) => setFilter(value)}>
        <TabsList>
          <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          <TabsTrigger value="user_registration">Users</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No notifications to show</p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`border-l-4 ${getNotificationColor(notification.type, notification.priority)} ${
                    !notification.read ? 'shadow-md' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`p-2 rounded-full ${
                          notification.type === 'milestone' ? 'bg-green-100 text-green-600' :
                          notification.type === 'user_registration' ? 'bg-blue-100 text-blue-600' :
                          notification.type === 'alert' ? 'bg-orange-100 text-orange-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">{notification.title}</h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {notification.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs text-gray-500 flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatTimeAgo(notification.timestamp)}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsPanel;
