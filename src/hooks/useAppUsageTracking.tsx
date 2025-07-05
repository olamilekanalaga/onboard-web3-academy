import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useAppUsageTracking = () => {
  const { user } = useAuth();
  const lastActivityRef = useRef<string | null>(null);
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const recordAppUsage = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Don't record if we already recorded today
      if (lastActivityRef.current === today) return;

      // Check if user already has app usage activity today
      const { data: existingActivity } = await supabase
        .from('user_activity_log')
        .select('id')
        .eq('user_id', user.id)
        .eq('activity_date', today)
        .eq('activity_type', 'app_usage')
        .single();

      // If no app usage activity today, record it
      if (!existingActivity) {
        await supabase
          .from('user_activity_log')
          .insert({
            user_id: user.id,
            activity_type: 'app_usage',
            activity_date: today,
            created_at: new Date().toISOString()
          });

        lastActivityRef.current = today;
        console.log('✅ App usage recorded for streak tracking');
      } else {
        lastActivityRef.current = today;
        console.log('App usage already recorded for today');
      }
    } catch (error) {
      console.error('Error recording app usage:', error);
    }
  };

  const handleUserActivity = () => {
    // Clear existing timeout
    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current);
    }

    // Set a new timeout to record activity after user stops being active
    activityTimeoutRef.current = setTimeout(() => {
      recordAppUsage();
    }, 1000); // Record after 1 second of activity
  };

  useEffect(() => {
    if (!user) return;

    // Record initial app usage when hook mounts
    recordAppUsage();

    // Add event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, true);
    });

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true);
      });
      
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
    };
  }, [user]);

  return {
    recordAppUsage
  };
};
