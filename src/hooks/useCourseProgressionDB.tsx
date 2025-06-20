
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useCourseProgressionDB = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

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

      return {
        completed: isCompleted,
        xpEarned,
        progressPercentage,
      };
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
    'foundation': { totalXP: 500, prerequisites: [] },
    'degen': { totalXP: 750, prerequisites: ['foundation'] },
    'advanced-trading': { totalXP: 1000, prerequisites: ['degen'] },
    'defi-fundamentals': { totalXP: 1200, prerequisites: ['advanced-trading'] },
    'nft-creation': { totalXP: 800, prerequisites: ['foundation'] },
    'dao-governance': { totalXP: 900, prerequisites: ['defi-fundamentals'] },
    'web3-security': { totalXP: 1100, prerequisites: ['advanced-trading'] },
    'crypto-tax': { totalXP: 600, prerequisites: ['foundation'] },
    'content-creation': { totalXP: 700, prerequisites: ['foundation'] },
    'web3-gaming': { totalXP: 850, prerequisites: ['nft-creation'] },
    'web3-social': { totalXP: 650, prerequisites: ['foundation'] },
  };

  return {
    getCourseProgress,
    updateChapterProgress,
    courseProgression,
  };
};
