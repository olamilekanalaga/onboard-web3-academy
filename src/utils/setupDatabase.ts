
import { supabase } from '@/integrations/supabase/client';

// Initialize user stats for new users
export const initializeUserStats = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('user_stats')
      .upsert({
        user_id: userId,
        total_xp: 0,
        level: 1,
        completed_courses: [],
        unlocked_courses: ['foundation'],
        achievements: [],
        current_streak: 0,
        longest_streak: 0,
        total_study_time: 0
      });

    if (error) {
      console.error('Error initializing user stats:', error);
    }
  } catch (error) {
    console.error('Error in initializeUserStats:', error);
  }
};

// Initialize user settings for new users
export const initializeUserSettings = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        theme: 'light',
        language: 'en',
        email_notifications: true,
        course_reminders: true,
        marketing_emails: false,
        show_progress: true,
        show_achievements: true,
        data_analytics: true
      });

    if (error) {
      console.error('Error initializing user settings:', error);
    }
  } catch (error) {
    console.error('Error in initializeUserSettings:', error);
  }
};

// Setup database for new user
export const setupUserDatabase = async (userId: string) => {
  await Promise.all([
    initializeUserStats(userId),
    initializeUserSettings(userId)
  ]);
};
