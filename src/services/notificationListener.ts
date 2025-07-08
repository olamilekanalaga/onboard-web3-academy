import { supabase } from '@/integrations/supabase/client';
import { pushNotificationService } from './pushNotificationService';

interface NotificationData {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data: any;
  read: boolean;
  created_at: string;
}

class NotificationListener {
  private subscription: any = null;
  private userId: string | null = null;

  async initialize(userId: string) {
    this.userId = userId;
    await this.setupRealtimeListener();
  }

  private async setupRealtimeListener() {
    if (!this.userId) return;

    // Clean up existing subscription
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    // Set up real-time listener for new notifications
    this.subscription = supabase
      .channel(`notifications-${this.userId}`)
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${this.userId}`
        },
        async (payload) => {
          console.log('🔔 Real-time notification received:', payload);
          const notification = payload.new as NotificationData;
          await this.handleNewNotification(notification);
        }
      )
      .subscribe((status) => {
        console.log('🔔 Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to notifications');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Channel error - retrying subscription');
          setTimeout(() => this.setupRealtimeListener(), 2000);
        }
      });

    console.log('🔔 Notification listener initialized for user:', this.userId);
  }

  private async handleNewNotification(notification: NotificationData) {
    console.log('📱 New notification received:', notification);

    // Check if user has granted notification permission
    const hasPermission = await pushNotificationService.hasPermission();
    if (!hasPermission) {
      console.log('❌ No notification permission, skipping push notification');
      return;
    }

    // Check if user is currently active (optional - you might want to skip notifications if user is active)
    const isUserActive = document.hasFocus() && document.visibilityState === 'visible';
    console.log('📱 User active status:', isUserActive, 'Focus:', document.hasFocus(), 'Visibility:', document.visibilityState);
    
    // Send push notification based on type
    switch (notification.type) {
      case 'message':
        const data = notification.data || {};
        if (!isUserActive) {
          // Send push notification when user is not active
          await pushNotificationService.sendTestPushNotification(
            notification.title,
            `${data.sender_name || 'Someone'}: ${data.message_preview || notification.message}`
          );
        } else {
          // Send in-app notification when user is active
          await pushNotificationService.sendMessageNotification(
            data.sender_name || 'Someone',
            data.message_preview || notification.message,
            data.url
          );
        }
        break;

      case 'follow':
        if (!isUserActive) {
          await pushNotificationService.sendTestPushNotification(
            notification.title,
            notification.message
          );
        } else {
          await pushNotificationService.sendSocialNotification(
            'follow',
            notification.message,
            notification.data?.url
          );
        }
        break;

      case 'reaction':
        if (!isUserActive) {
          await pushNotificationService.sendTestPushNotification(
            notification.title,
            notification.message
          );
        } else {
          await pushNotificationService.sendSocialNotification(
            'reaction',
            notification.message,
            notification.data?.url
          );
        }
        break;

      case 'course_completion':
      case 'achievement':
        if (!isUserActive) {
          await pushNotificationService.sendTestPushNotification(
            notification.title,
            notification.message
          );
        } else {
          await pushNotificationService.sendSocialNotification(
            'achievement',
            notification.message,
            notification.data?.url
          );
        }
        break;

      default:
        // Generic notification
        await pushNotificationService.showLocalNotification({
          title: notification.title,
          body: notification.message,
          data: {
            type: notification.type,
            url: notification.data?.url || '/social'
          }
        });
    }
  }

  async cleanup() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    this.userId = null;
    console.log('🔔 Notification listener cleaned up');
  }

  // Method to manually trigger a test notification
  async sendTestNotification() {
    if (!this.userId) return;

    try {
      await supabase
        .from('notifications')
        .insert({
          user_id: this.userId,
          type: 'test',
          title: 'Test Notification',
          message: 'This is a test notification from Academia!',
          data: { url: '/social' }
        });

      console.log('✅ Test notification sent');
    } catch (error) {
      console.error('❌ Error sending test notification:', error);
    }
  }

  // Method to check if listener is active
  getStatus() {
    return {
      isInitialized: !!this.subscription,
      userId: this.userId,
      subscriptionState: this.subscription?.state
    };
  }
}

export const notificationListener = new NotificationListener();
