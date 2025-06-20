
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserStats {
  id: string;
  user_id: string;
  total_xp: number;
  level: number;
  completed_courses: string[];
  unlocked_courses: string[];
  achievements: string[];
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  total_study_time: number;
  created_at: string;
  updated_at: string;
}

export const useUserStats = () => {
  const { user } = useAuth();

  const { data: userStats, isLoading, error, refetch } = useQuery({
    queryKey: ['user-stats', user?.id],
    queryFn: async () => {
      if (!user) return null;

      try {
        const { data, error } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code === 'PGRST116') {
          // User stats don't exist, create default
          const defaultStats = {
            user_id: user.id,
            total_xp: 0,
            level: 1,
            completed_courses: [],
            unlocked_courses: ['foundation'],
            achievements: [],
            current_streak: 0,
            longest_streak: 0,
            last_activity_date: null,
            total_study_time: 0
          };

          const { data: newStats, error: insertError } = await supabase
            .from('user_stats')
            .insert(defaultStats)
            .select()
            .single();

          if (insertError) throw insertError;
          return newStats;
        }

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching user stats:', error);
        throw error;
      }
    },
    enabled: !!user,
  });

  const updateUserStats = async (updates: Partial<UserStats>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_stats')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Refetch to get updated data
      refetch();
    } catch (error) {
      console.error('Error updating user stats:', error);
      throw error;
    }
  };

  return {
    userStats,
    isLoading,
    error,
    updateUserStats,
    refetch
  };
};
