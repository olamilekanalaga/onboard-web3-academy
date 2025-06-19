
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CourseProgress {
  courseId: string;
  completed: boolean;
  progressPercentage: number;
  completedAt?: Date;
}

export interface UserProgressData {
  completedCourses: string[];
  courseProgress: Record<string, CourseProgress>;
}

// Hook to get user progress from database
export const useCourseProgressionSimple = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get user progress from database
  const { data: userProgress, isLoading, error } = useQuery({
    queryKey: ['course-progression', user?.id],
    queryFn: async () => {
      if (!user) {
        return {
          completedCourses: [],
          courseProgress: {}
        };
      }

      try {
        // Get detailed progress for each course
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id);

        if (progressError) {
          console.error('Progress error:', progressError);
          throw progressError;
        }

        // Transform database data to our format
        const courseProgress: Record<string, CourseProgress> = {};
        const completedCourses: string[] = [];

        progressData?.forEach(progress => {
          courseProgress[progress.course_id] = {
            courseId: progress.course_id,
            completed: progress.progress_percentage === 100,
            progressPercentage: progress.progress_percentage || 0,
            completedAt: progress.completed_at ? new Date(progress.completed_at) : undefined,
          };

          if (progress.progress_percentage === 100) {
            completedCourses.push(progress.course_id);
          }
        });

        return {
          completedCourses,
          courseProgress
        } as UserProgressData;
      } catch (error) {
        console.error('Database error, falling back to defaults:', error);
        return {
          completedCourses: [],
          courseProgress: {}
        };
      }
    },
    enabled: true,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  // Mutation to update lesson progress
  const updateLessonProgressMutation = useMutation({
    mutationFn: async ({ courseId, lessonId }: {
      courseId: string;
      lessonId: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      // For now, we'll mark the course as 100% complete when any lesson is completed
      // This is a simplified approach since we don't have chapter tracking in the current schema
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: lessonId,
          progress_percentage: 100,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-progression'] });
    },
  });

  // Helper functions
  const getCourseProgress = (courseId: string): CourseProgress | null => {
    return userProgress?.courseProgress[courseId] || null;
  };

  const updateLessonProgress = (courseId: string, lessonId: string) => {
    updateLessonProgressMutation.mutate({ courseId, lessonId });
  };

  return {
    userProgress: userProgress || {
      completedCourses: [],
      courseProgress: {}
    },
    isLoading,
    getCourseProgress,
    updateLessonProgress,
  };
};
