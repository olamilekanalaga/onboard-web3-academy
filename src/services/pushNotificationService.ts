import { supabase } from '@/integrations/supabase/client';

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

class PushNotificationService {
  private registration: ServiceWorkerRegistration | null = null;
  private vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HI0DLLuxazjqAKVXTdtToTnMqz9YBPw6zV6DKBM6Q1JX_3_NM_A3SQ8TkE';

  async initialize() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications are not supported');
      return false;
    }

    try {
      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', this.registration);
      return true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Notifications are not supported');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      console.warn('Notification permission denied');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  async subscribe(userId: string): Promise<boolean> {
    if (!this.registration) {
      console.error('Service Worker not registered');
      return false;
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
      });

      // Save subscription to database
      await supabase
        .from('push_notification_tokens')
        .upsert({
          user_id: userId,
          token: JSON.stringify(subscription),
          device_type: 'web',
          is_active: true
        });

      console.log('Push subscription saved:', subscription);
      return true;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return false;
    }
  }

  async unsubscribe(userId: string): Promise<boolean> {
    if (!this.registration) {
      return false;
    }

    try {
      const subscription = await this.registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        
        // Remove from database
        await supabase
          .from('push_notification_tokens')
          .update({ is_active: false })
          .eq('user_id', userId);
      }
      return true;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return false;
    }
  }

  async showLocalNotification(payload: NotificationPayload) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    const notification = new Notification(payload.title, {
      body: payload.body,
      icon: payload.icon || '/ACADEMIA MOBILE.PNG',
      badge: payload.badge || '/ACADEMIA MOBILE.PNG',
      data: payload.data,
      actions: payload.actions,
      requireInteraction: true,
      tag: 'academia-notification'
    });

    notification.onclick = (event) => {
      event.preventDefault();
      window.focus();
      
      if (payload.data?.url) {
        window.location.href = payload.data.url;
      }
      
      notification.close();
    };

    // Auto close after 10 seconds
    setTimeout(() => {
      notification.close();
    }, 10000);
  }

  async sendCourseReminder(userId: string, courseTitle: string, courseUrl: string) {
    await this.showLocalNotification({
      title: '📚 Continue Learning',
      body: `You have an unfinished course: ${courseTitle}`,
      data: {
        type: 'course_reminder',
        url: courseUrl
      },
      actions: [
        {
          action: 'continue',
          title: 'Continue Course'
        },
        {
          action: 'dismiss',
          title: 'Later'
        }
      ]
    });
  }

  async sendMessageNotification(senderName: string, messagePreview: string, conversationUrl?: string) {
    await this.showLocalNotification({
      title: '💬 New Message',
      body: `${senderName}: ${messagePreview}`,
      data: {
        type: 'message',
        url: conversationUrl || '/social'
      },
      actions: [
        {
          action: 'reply',
          title: 'Reply'
        },
        {
          action: 'view',
          title: 'View'
        }
      ]
    });
  }

  async sendSocialNotification(type: string, message: string, actionUrl?: string) {
    const titles = {
      follow: '👥 New Follower',
      reaction: '❤️ New Reaction',
      comment: '💬 New Comment',
      achievement: '🏆 Achievement Unlocked',
      message: '💬 New Message'
    };

    await this.showLocalNotification({
      title: titles[type as keyof typeof titles] || '🔔 Academia Notification',
      body: message,
      data: {
        type: 'social_notification',
        url: actionUrl || '/social'
      },
      actions: [
        {
          action: 'view',
          title: 'View'
        }
      ]
    });
  }

  // Test method to send a push notification via service worker
  async sendTestPushNotification(title: string, body: string) {
    if (!this.registration) {
      console.error('Service Worker not registered');
      return false;
    }

    try {
      // Send message to service worker to show notification
      if (this.registration.active) {
        this.registration.active.postMessage({
          type: 'SHOW_NOTIFICATION',
          payload: {
            title,
            body,
            icon: '/ACADEMIA MOBILE.PNG',
            badge: '/ACADEMIA MOBILE.PNG',
            tag: 'academia-test',
            requireInteraction: true,
            data: {
              url: '/mobile/social'
            }
          }
        });
        return true;
      }
    } catch (error) {
      console.error('Error sending test push notification:', error);
    }
    return false;
  }

  async sendStreakReminder(currentStreak: number) {
    await this.showLocalNotification({
      title: '🔥 Keep Your Streak Alive!',
      body: `You have a ${currentStreak}-day learning streak. Don't break it!`,
      data: {
        type: 'streak_reminder',
        url: '/courses'
      },
      actions: [
        {
          action: 'learn',
          title: 'Start Learning'
        }
      ]
    });
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Check if user has enabled notifications
  async hasPermission(): Promise<boolean> {
    return Notification.permission === 'granted';
  }

  // Get current subscription status
  async isSubscribed(): Promise<boolean> {
    if (!this.registration) {
      return false;
    }

    try {
      const subscription = await this.registration.pushManager.getSubscription();
      return !!subscription;
    } catch (error) {
      return false;
    }
  }
}

export const pushNotificationService = new PushNotificationService();

// Auto-initialize when imported
pushNotificationService.initialize();
