import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  calculateStreaks, 
  generateActivityRecords, 
  recordTodayActivity,
  StreakData 
} from '@/utils/streakCalculator';

export const useStreaks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get user's streak data
  const { data: streakData, isLoading, error } = useQuery({
    queryKey: ['user-streaks', user?.id],
    queryFn: async (): Promise<StreakData> => {
      if (!user) {
        return {
          currentStreak: 0,
          longestStreak: 0,
          lastActivityDate: null,
          streakStatus: 'new'
        };
      }

      try {
        // Get user's activity data from multiple sources
        const [progressData, statsData] = await Promise.all([
          // Get course/chapter completion data
          supabase
            .from('user_progress')
            .select('completed_at, updated_at, completed_chapters')
            .eq('user_id', user.id),
          
          // Get current stats
          supabase
            .from('user_stats')
            .select('current_streak, longest_streak, last_activity_date')
            .eq('user_id', user.id)
            .single()
        ]);

        if (progressData.error && progressData.error.code !== 'PGRST116') {
          throw progressData.error;
        }

        // Generate activity records from progress data
        const activityRecords = generateActivityRecords(progressData.data || []);
        
        // Calculate streaks from activity
        const calculatedStreaks = calculateStreaks(activityRecords);
        
        // If we have existing stats, compare and use the most accurate data
        if (statsData.data && !statsData.error) {
          const dbStreaks = statsData.data;
          
          // Use calculated streaks if they're more recent or accurate
          const shouldUseCalculated = 
            !dbStreaks.last_activity_date || 
            (calculatedStreaks.lastActivityDate && 
             new Date(calculatedStreaks.lastActivityDate) > new Date(dbStreaks.last_activity_date));
          
          if (shouldUseCalculated) {
            // Update database with calculated values
            await supabase
              .from('user_stats')
              .update({
                current_streak: calculatedStreaks.currentStreak,
                longest_streak: Math.max(calculatedStreaks.longestStreak, dbStreaks.longest_streak || 0),
                last_activity_date: calculatedStreaks.lastActivityDate,
                updated_at: new Date().toISOString()
              })
              .eq('user_id', user.id);
            
            return {
              ...calculatedStreaks,
              longestStreak: Math.max(calculatedStreaks.longestStreak, dbStreaks.longest_streak || 0)
            };
          } else {
            // Use database values
            return {
              currentStreak: dbStreaks.current_streak || 0,
              longestStreak: dbStreaks.longest_streak || 0,
              lastActivityDate: dbStreaks.last_activity_date,
              streakStatus: dbStreaks.current_streak > 0 ? 'active' : 'new'
            };
          }
        } else {
          // No existing stats, create new record
          await supabase
            .from('user_stats')
            .upsert({
              user_id: user.id,
              current_streak: calculatedStreaks.currentStreak,
              longest_streak: calculatedStreaks.longestStreak,
              last_activity_date: calculatedStreaks.lastActivityDate,
              total_xp: 0,
              level: 1,
              completed_courses: [],
              unlocked_courses: ['foundation'],
              achievements: [],
              total_study_time: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          
          return calculatedStreaks;
        }
      } catch (error) {
        console.error('Error calculating streaks:', error);
        return {
          currentStreak: 0,
          longestStreak: 0,
          lastActivityDate: null,
          streakStatus: 'new'
        };
      }
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  });

  // Update streak when user completes an activity
  const updateStreak = useMutation({
    mutationFn: async (activityType: 'course_completion' | 'chapter_completion' | 'quiz_completion' | 'login') => {
      if (!user) throw new Error('User not authenticated');
      
      const today = new Date().toISOString().split('T')[0];
      
      // Check if user already has activity today
      const { data: existingActivity } = await supabase
        .from('user_activity_log')
        .select('id')
        .eq('user_id', user.id)
        .eq('activity_date', today)
        .single();
      
      // If no activity today, record it
      if (!existingActivity) {
        await supabase
          .from('user_activity_log')
          .insert({
            user_id: user.id,
            activity_type: activityType,
            activity_date: today,
            created_at: new Date().toISOString()
          });
      }
      
      // Recalculate streaks
      return recordTodayActivity(user.id, activityType);
    },
    onSuccess: () => {
      // Invalidate and refetch streak data
      queryClient.invalidateQueries({ queryKey: ['user-streaks', user?.id] });
    },
  });

  return {
    streakData,
    isLoading,
    error,
    updateStreak: updateStreak.mutate,
    isUpdating: updateStreak.isPending,
  };
};

// Hook to get streak statistics for display
export const useStreakStats = () => {
  const { streakData } = useStreaks();
  
  if (!streakData) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      streakStatus: 'new' as const,
      isActive: false,
      daysUntilNextMilestone: 0,
      nextMilestone: 3,
    };
  }
  
  const { currentStreak, longestStreak, streakStatus } = streakData;
  const isActive = streakStatus === 'active';
  
  // Calculate next milestone
  const milestones = [3, 7, 14, 30, 60, 100, 365];
  const nextMilestone = milestones.find(m => m > currentStreak) || 365;
  const daysUntilNextMilestone = nextMilestone - currentStreak;
  
  return {
    currentStreak,
    longestStreak,
    streakStatus,
    isActive,
    daysUntilNextMilestone,
    nextMilestone,
  };
};
