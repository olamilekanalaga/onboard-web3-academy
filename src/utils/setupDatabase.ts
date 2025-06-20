
import { supabase } from '@/integrations/supabase/client';

export const initializeUserStats = async (userId: string) => {
  try {
    // Check if user stats already exist
    const { data: existingStats, error: checkError } = await supabase
      .from('user_stats')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing user stats:', checkError);
      return;
    }

    // Only create if stats don't exist
    if (!existingStats) {
      const { error } = await supabase
        .from('user_stats')
        .insert({
          user_id: userId,
          total_xp: 0,
          level: 1,
          completed_courses: [],
          unlocked_courses: ['foundation'],
          achievements: [],
          current_streak: 0,
          longest_streak: 0,
          total_study_time: 0,
          last_activity_date: new Date().toISOString().split('T')[0]
        });

      if (error) {
        console.error('Error initializing user stats:', error);
      } else {
        console.log('User stats initialized successfully');
      }
    } else {
      console.log('User stats already exist, skipping initialization');
    }
  } catch (error) {
    console.error('Error in initializeUserStats:', error);
  }
};
