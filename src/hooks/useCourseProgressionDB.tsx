
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useCourseProgressionDB = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get user stats and progress
  const { data: userStats, isLoading } = useQuery({
    queryKey: ['user-stats', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user stats:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user,
  });

  // Get course progress from database
  const getCourseProgress = (courseId: string) => {
    const { data: progressData } = useQuery({
      queryKey: ['course-progress', user?.id, courseId],
      queryFn: async () => {
        if (!user) return null;
        
        const { data, error } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', courseId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching course progress:', error);
          return null;
        }
        
        return data;
      },
      enabled: !!user,
    });

    return progressData;
  };

  // Update chapter progress
  const updateChapterProgress = useMutation({
    mutationFn: async ({ 
      courseId, 
      chapterId, 
      totalChapters 
    }: { 
      courseId: string; 
      chapterId: string; 
      totalChapters: number; 
    }) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('Updating chapter progress:', { courseId, chapterId, totalChapters, userId: user.id });

      try {
        // First, get existing progress
        const { data: existingProgress } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', courseId)
          .single();

        const currentCompletedChapters = existingProgress?.completed_chapters || [];
        
        // Add current chapter if not already completed
        let updatedCompletedChapters = [...currentCompletedChapters];
        if (!updatedCompletedChapters.includes(chapterId)) {
          updatedCompletedChapters.push(chapterId);
        }

        const progressPercentage = Math.round((updatedCompletedChapters.length / totalChapters) * 100);
        const isCompleted = progressPercentage >= 100;
        const xpEarned = isCompleted ? 500 : Math.round(progressPercentage * 5); // 5 XP per percent

        console.log('Calculated progress:', { 
          progressPercentage, 
          isCompleted, 
          xpEarned, 
          completedChapters: updatedCompletedChapters.length,
          totalChapters 
        });

        const updateData = {
          user_id: user.id,
          course_id: courseId,
          completed_chapters: updatedCompletedChapters,
          progress_percentage: progressPercentage,
          xp_earned: xpEarned,
          completed_at: isCompleted ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
          .from('user_progress')
          .upsert(updateData)
          .select()
          .single();

        if (error) {
          console.error('Database error details:', error);
          throw new Error(`Failed to update progress: ${error.message}`);
        }

        console.log('Progress updated successfully:', data);

        // Update user stats if course completed
        if (isCompleted) {
          const currentStats = userStats || { 
            user_id: user.id, 
            total_xp: 0, 
            completed_courses: [], 
            unlocked_courses: ['foundation'],
            level: 1
          };

          const newCompletedCourses = [...(currentStats.completed_courses || [])];
          if (!newCompletedCourses.includes(courseId)) {
            newCompletedCourses.push(courseId);
          }

          const newTotalXP = (currentStats.total_xp || 0) + xpEarned;
          const newLevel = Math.floor(newTotalXP / 1000) + 1;

          await supabase
            .from('user_stats')
            .upsert({
              user_id: user.id,
              total_xp: newTotalXP,
              completed_courses: newCompletedCourses,
              level: newLevel,
              updated_at: new Date().toISOString(),
            });
        }

        return {
          completed: isCompleted,
          xpEarned,
          progressPercentage,
        };
      } catch (error) {
        console.error('Error in updateChapterProgress:', error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch course progress
      queryClient.invalidateQueries({ 
        queryKey: ['course-progress', user?.id, variables.courseId] 
      });
      
      // Also invalidate user stats if course completed
      if (data.completed) {
        queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      }

      toast.success('Progress updated successfully!');
    },
    onError: (error) => {
      console.error('Failed to update progress:', error);
      toast.error(`Failed to update progress: ${error.message}`);
    },
  });

  const courseProgression = {
    'foundation': { totalXP: 500, prerequisites: [], level: 'Foundation', xpReward: 500, estimatedTime: '2 hours' },
    'degen': { totalXP: 750, prerequisites: ['foundation'], level: 'Beginner', xpReward: 750, estimatedTime: '3 hours' },
    'advanced-trading': { totalXP: 1000, prerequisites: ['degen'], level: 'Intermediate', xpReward: 1000, estimatedTime: '4 hours' },
    'defi-fundamentals': { totalXP: 1200, prerequisites: ['advanced-trading'], level: 'Intermediate', xpReward: 1200, estimatedTime: '5 hours' },
    'nft-creation': { totalXP: 800, prerequisites: ['foundation'], level: 'Beginner', xpReward: 800, estimatedTime: '3 hours' },
    'dao-governance': { totalXP: 900, prerequisites: ['defi-fundamentals'], level: 'Advanced', xpReward: 900, estimatedTime: '4 hours' },
    'web3-security': { totalXP: 1100, prerequisites: ['advanced-trading'], level: 'Advanced', xpReward: 1100, estimatedTime: '5 hours' },
    'crypto-tax': { totalXP: 600, prerequisites: ['foundation'], level: 'Beginner', xpReward: 600, estimatedTime: '2 hours' },
    'content-creation': { totalXP: 700, prerequisites: ['foundation'], level: 'Beginner', xpReward: 700, estimatedTime: '3 hours' },
    'web3-gaming': { totalXP: 850, prerequisites: ['nft-creation'], level: 'Intermediate', xpReward: 850, estimatedTime: '4 hours' },
    'web3-social': { totalXP: 650, prerequisites: ['foundation'], level: 'Beginner', xpReward: 650, estimatedTime: '3 hours' },
  };

  // Helper functions
  const isCourseUnlocked = (courseId: string) => {
    const unlockedCourses = userStats?.unlocked_courses || ['foundation'];
    return unlockedCourses.includes(courseId);
  };

  const isCourseCompleted = (courseId: string) => {
    const completedCourses = userStats?.completed_courses || [];
    return completedCourses.includes(courseId);
  };

  const getNextRecommendedCourse = () => {
    const completedCourses = userStats?.completed_courses || [];
    const unlockedCourses = userStats?.unlocked_courses || ['foundation'];
    
    // Find first unlocked but not completed course
    for (const courseId of unlockedCourses) {
      if (!completedCourses.includes(courseId)) {
        return { id: courseId };
      }
    }
    
    return null;
  };

  const userProgress = {
    totalXP: userStats?.total_xp || 0,
    currentLevel: userStats?.level || 1,
    completedCourses: userStats?.completed_courses || [],
    unlockedCourses: userStats?.unlocked_courses || ['foundation'],
  };

  return {
    getCourseProgress,
    updateChapterProgress,
    courseProgression,
    userProgress,
    isCourseUnlocked,
    isCourseCompleted,
    getNextRecommendedCourse,
    isLoading,
    isUpdating: updateChapterProgress.isPending,
  };
};
