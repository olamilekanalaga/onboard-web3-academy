
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ensureDatabaseTables, createUserStatsIfNotExists } from '@/utils/databaseSetup';
import { courses } from '@/data/courses';
import { toast } from 'sonner';

export const useCourseProgressionDB = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Check database setup on mount
  useEffect(() => {
    if (user) {
      ensureDatabaseTables();
      createUserStatsIfNotExists(user.id);
    }
  }, [user]);

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

  // Get all course progress from database
  const { data: allProgressData, error: progressError } = useQuery({
    queryKey: ['all-course-progress', user?.id],
    queryFn: async () => {
      if (!user) return [];

      try {
        const { data, error } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('Supabase progress error:', error);
          // Handle specific database errors gracefully
          if (error.code === '42P01') {
            console.log('user_progress table does not exist yet');
            return [];
          }
          if (error.code === 'PGRST301' || error.message.includes('406')) {
            console.log('RLS or permission issue, returning empty progress');
            return [];
          }
          throw error;
        }

        console.log('Successfully fetched progress data:', data);
        return data || [];
      } catch (error) {
        console.error('Error in progress query:', error);
        return []; // Always return empty array instead of throwing
      }
    },
    enabled: !!user,
    retry: false, // Don't retry failed queries
  });

  // Function to get specific course progress (no longer uses hooks)
  const getCourseProgress = (courseId: string) => {
    if (!allProgressData) return null;
    const progress = allProgressData.find(progress => progress.course_id === courseId);
    if (!progress) return null;

    // Get actual total chapters from course data
    const course = courses[courseId];
    const actualTotalChapters = course && course.modules && Array.isArray(course.modules)
      ? course.modules.reduce((sum: number, module: any) => {
          return sum + (module.chapters && Array.isArray(module.chapters) ? module.chapters.length : 0);
        }, 0)
      : 0;

    return {
      courseId: progress.course_id,
      completedChapters: progress.completed_chapters || [],
      progressPercentage: progress.progress_percentage || 0,
      progress_percentage: progress.progress_percentage || 0, // Add both formats for compatibility
      xpEarned: progress.xp_earned || 0,
      completedAt: progress.completed_at,
      totalChapters: actualTotalChapters, // Use actual total from course data
    };
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
          lesson_id: null, // Add this field to match database schema
        };

        const { data, error } = await supabase
          .from('user_progress')
          .upsert(updateData, {
            onConflict: 'user_id,course_id',
            ignoreDuplicates: false
          })
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
            }, {
              onConflict: 'user_id',
              ignoreDuplicates: false
            });

          // Create social progress entry for course completion
          try {
            await supabase.from('social_progress').insert({
              user_id: user.id,
              activity_type: 'course_completed',
              title: `Completed ${courseId}!`,
              description: `Just finished the ${courseId} course and earned ${xpEarned} XP! 🎉`,
              course_id: courseId,
              xp_earned: xpEarned,
              user_email: user.email,
              user_name: user.user_metadata?.full_name || user.email,
              user_avatar: user.user_metadata?.avatar_url,
              is_public: true
            });

            console.log('✅ Social progress entry created for course completion');
          } catch (error) {
            console.error('Error creating social progress entry:', error);
          }
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
      console.log('🔄 Progress update successful, syncing across devices...');

      // Invalidate and refetch course progress for real-time sync
      queryClient.invalidateQueries({
        queryKey: ['course-progress', user?.id, variables.courseId]
      });

      // Invalidate all user progress to sync across mobile/desktop
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      queryClient.invalidateQueries({ queryKey: ['courseProgression'] });

      // Force immediate refetch for instant sync
      queryClient.refetchQueries({ queryKey: ['userProgress'] });

      // Also invalidate user stats if course completed
      if (data.completed) {
        queryClient.invalidateQueries({ queryKey: ['user-stats'] });
        console.log('🎉 Course completed! Syncing completion status...');
      }

      toast.success('Progress updated successfully!');
    },
    onError: (error) => {
      console.error('Failed to update progress:', error);
      toast.error(`Failed to update progress: ${error.message}`);
    },
  });

  const courseProgression = {
    'foundation': {
      id: 'foundation',
      title: 'Foundation',
      totalXP: 500,
      prerequisites: [],
      level: 'Foundation',
      xpReward: 500,
      estimatedTime: '2 hours',
      difficulty: 1
    },
    'degen': {
      id: 'degen',
      title: 'Degen Trading',
      totalXP: 750,
      prerequisites: ['foundation'],
      level: 'Beginner',
      xpReward: 750,
      estimatedTime: '3 hours',
      difficulty: 2
    },
    'advanced-trading': {
      id: 'advanced-trading',
      title: 'Advanced Trading',
      totalXP: 1000,
      prerequisites: ['degen'],
      level: 'Intermediate',
      xpReward: 1000,
      estimatedTime: '4 hours',
      difficulty: 3
    },
    'defi-fundamentals': {
      id: 'defi-fundamentals',
      title: 'DeFi Fundamentals',
      totalXP: 1200,
      prerequisites: ['advanced-trading'],
      level: 'Intermediate',
      xpReward: 1200,
      estimatedTime: '5 hours',
      difficulty: 3
    },
    'nft-creation': {
      id: 'nft-creation',
      title: 'NFT Creation & Trading',
      totalXP: 800,
      prerequisites: ['foundation'],
      level: 'Beginner',
      xpReward: 800,
      estimatedTime: '3 hours',
      difficulty: 2
    },
    'dao-governance': {
      id: 'dao-governance',
      title: 'DAO Governance',
      totalXP: 900,
      prerequisites: ['defi-fundamentals'],
      level: 'Advanced',
      xpReward: 900,
      estimatedTime: '4 hours',
      difficulty: 4
    },
    'web3-security': {
      id: 'web3-security',
      title: 'Web3 Security',
      totalXP: 1100,
      prerequisites: ['advanced-trading'],
      level: 'Advanced',
      xpReward: 1100,
      estimatedTime: '5 hours',
      difficulty: 4
    },
    'crypto-tax': {
      id: 'crypto-tax',
      title: 'Crypto Tax & Legal Basics',
      totalXP: 600,
      prerequisites: ['foundation'],
      level: 'Beginner',
      xpReward: 600,
      estimatedTime: '2 hours',
      difficulty: 2
    },
    'content-creation': {
      id: 'content-creation',
      title: 'Content Creation',
      totalXP: 700,
      prerequisites: ['foundation'],
      level: 'Beginner',
      xpReward: 700,
      estimatedTime: '3 hours',
      difficulty: 2
    },
    'web3-gaming': {
      id: 'web3-gaming',
      title: 'Web3 Gaming & Play-to-Earn',
      totalXP: 850,
      prerequisites: ['nft-creation'],
      level: 'Intermediate',
      xpReward: 850,
      estimatedTime: '4 hours',
      difficulty: 3
    },
    'web3-social': {
      id: 'web3-social',
      title: 'Web3 Social Media & Community Building',
      totalXP: 650,
      prerequisites: ['foundation'],
      level: 'Beginner',
      xpReward: 650,
      estimatedTime: '3 hours',
      difficulty: 2
    },
    'development': {
      id: 'development',
      title: 'Blockchain Development Mastery',
      totalXP: 2500,
      prerequisites: ['advanced-trading'],
      level: 'Advanced',
      xpReward: 2500,
      estimatedTime: '8-12 weeks',
      difficulty: 5
    },
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

  // Debug completed courses
  console.log('Hook - UserStats:', userStats);
  console.log('Hook - Completed Courses Raw:', userStats?.completed_courses);
  console.log('Hook - Completed Courses Final:', userProgress.completedCourses);
  console.log('Hook - Completed Count:', userProgress.completedCourses.length);

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
