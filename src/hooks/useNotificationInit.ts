import { useEffect } from 'react';
import { notificationListener } from '@/services/notificationListener';
import { pushNotificationService } from '@/services/pushNotificationService';
import { supabase } from '@/integrations/supabase/client';

export const useNotificationInit = (userId: string | null) => {
  useEffect(() => {
    const initializeNotifications = async () => {
      if (!userId) {
        // Clean up if user logs out
        await notificationListener.cleanup();
        return;
      }

      try {
        // Check if user has notification preferences
        const { data: preferences } = await supabase
          .from('user_notification_preferences')
          .select('push_enabled')
          .eq('user_id', userId)
          .single();

        // If user has enabled push notifications, initialize the services
        if (preferences?.push_enabled) {
          // Check if browser supports notifications and user has granted permission
          if ('Notification' in window && Notification.permission === 'granted') {
            await pushNotificationService.initialize();
            await notificationListener.initialize(userId);
            console.log('🔔 Notifications initialized for user:', userId);
          }
        }
      } catch (error) {
        console.log('No notification preferences found or error initializing:', error);
      }
    };

    initializeNotifications();

    // Cleanup on unmount or user change
    return () => {
      if (!userId) {
        notificationListener.cleanup();
      }
    };
  }, [userId]);
};
