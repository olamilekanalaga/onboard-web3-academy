
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CourseProgress {
  courseId: string;
  completed: boolean;
  completedChapters: string[];
  totalChapters: number;
  progressPercentage: number;
  completedAt?: Date;
  xpEarned: number;
}

export interface UserProgressData {
  completedCourses: string[];
  unlockedCourses: string[];
  totalXP: number;
  currentLevel: number;
  courseProgress: Record<string, CourseProgress>;
}

const COURSE_PROGRESSION = {
  foundation: {
    id: 'foundation',
    title: 'Foundation',
    level: 'Foundation',
    category: 'fundamentals',
    difficulty: 1,
    estimatedTime: '2-3 weeks',
    unlocks: ['defi-fundamentals'],
    xpReward: 500,
    prerequisites: [],
    totalChapters: 8
  },
  'defi-fundamentals': {
    id: 'defi-fundamentals',
    title: 'DeFi Fundamentals',
    level: 'Beginner',
    category: 'defi',
    difficulty: 2,
    estimatedTime: '3-4 weeks',
    unlocks: ['degen', 'content-creation'],
    xpReward: 750,
    prerequisites: ['foundation'],
    totalChapters: 12
  },
  'degen': {
    id: 'degen',
    title: 'Degen Trading',
    level: 'Intermediate',
    category: 'trading',
    difficulty: 3,
    estimatedTime: '2-3 weeks',
    unlocks: ['advanced-trading'],
    xpReward: 900,
    prerequisites: ['defi-fundamentals'],
    totalChapters: 10
  },
  'content-creation': {
    id: 'content-creation',
    title: 'Content Creation',
    level: 'Intermediate',
    category: 'content',
    difficulty: 3,
    estimatedTime: '3-4 weeks',
    unlocks: ['development'],
    xpReward: 800,
    prerequisites: ['defi-fundamentals'],
    totalChapters: 15
  },
  'advanced-trading': {
    id: 'advanced-trading',
    title: 'Advanced Trading',
    level: 'Advanced',
    category: 'trading',
    difficulty: 4,
    estimatedTime: '4-5 weeks',
    unlocks: ['development'],
    xpReward: 1200,
    prerequisites: ['degen'],
    totalChapters: 18
  },
  'development': {
    id: 'development',
    title: 'Blockchain Development',
    level: 'Advanced',
    category: 'development',
    difficulty: 5,
    estimatedTime: '6-8 weeks',
    unlocks: [],
    xpReward: 1500,
    prerequisites: ['content-creation', 'advanced-trading'],
    totalChapters: 25
  },
  'nft-creation': {
    id: 'nft-creation',
    title: 'NFT Creation',
    level: 'Intermediate',
    category: 'content',
    difficulty: 3,
    estimatedTime: '2-3 weeks',
    unlocks: ['web3-security'],
    xpReward: 700,
    prerequisites: ['defi-fundamentals'],
    totalChapters: 12
  },
  'web3-security': {
    id: 'web3-security',
    title: 'Web3 Security Essentials',
    level: 'Beginner',
    category: 'security',
    difficulty: 2,
    estimatedTime: '2-3 weeks',
    unlocks: ['dao-governance', 'web3-gaming'],
    xpReward: 600,
    prerequisites: ['foundation'],
    totalChapters: 10
  },
  'dao-governance': {
    id: 'dao-governance',
    title: 'DAO Participation & Governance',
    level: 'Intermediate',
    category: 'governance',
    difficulty: 3,
    estimatedTime: '2-3 weeks',
    unlocks: ['crypto-tax'],
    xpReward: 800,
    prerequisites: ['web3-security'],
    totalChapters: 12
  },
  'web3-gaming': {
    id: 'web3-gaming',
    title: 'Web3 Gaming & Play-to-Earn',
    level: 'Beginner',
    category: 'gaming',
    difficulty: 2,
    estimatedTime: '2-3 weeks',
    unlocks: ['web3-social'],
    xpReward: 650,
    prerequisites: ['web3-security'],
    totalChapters: 11
  },
  'crypto-tax': {
    id: 'crypto-tax',
    title: 'Crypto Tax & Legal Basics',
    level: 'Beginner',
    category: 'legal',
    difficulty: 2,
    estimatedTime: '2 weeks',
    unlocks: ['web3-social'],
    xpReward: 550,
    prerequisites: ['dao-governance'],
    totalChapters: 8
  },
  'web3-social': {
    id: 'web3-social',
    title: 'Web3 Social Media & Community Building',
    level: 'Beginner',
    category: 'social',
    difficulty: 2,
    estimatedTime: '2-3 weeks',
    unlocks: [],
    xpReward: 700,
    prerequisites: ['web3-gaming', 'crypto-tax'],
    totalChapters: 13
  }
};

// Hook to get user progress from database
export const useCourseProgressionDB = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get user progress from database
  const { data: userProgress, isLoading, error } = useQuery({
    queryKey: ['course-progression', user?.id],
    queryFn: async () => {
      if (!user) {
        return {
          completedCourses: [],
          unlockedCourses: ['foundation'],
          totalXP: 0,
          currentLevel: 1,
          courseProgress: {}
        };
      }

      try {
        // Get user stats
        const { data: userStats, error: statsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (statsError && (statsError.code === 'PGRST116' || statsError.code === '42P01')) {
          console.log('User stats not found, using defaults');
          return {
            completedCourses: [],
            unlockedCourses: ['foundation'],
            totalXP: 0,
            currentLevel: 1,
            courseProgress: {}
          };
        }

        if (statsError) {
          console.error('Stats error:', statsError);
          throw statsError;
        }

        // Get detailed progress for each course
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id);

        if (progressError && progressError.code === '42P01') {
          console.log('User progress table not found, using defaults');
          return {
            completedCourses: userStats?.completed_courses || [],
            unlockedCourses: userStats?.unlocked_courses || ['foundation'],
            totalXP: userStats?.total_xp || 0,
            currentLevel: userStats?.level || 1,
            courseProgress: {}
          };
        }

        if (progressError) {
          console.error('Progress error:', progressError);
          throw progressError;
        }

        // Transform database data to our format
        const courseProgress: Record<string, CourseProgress> = {};
        progressData?.forEach(progress => {
          const courseConfig = COURSE_PROGRESSION[progress.course_id as keyof typeof COURSE_PROGRESSION];
          courseProgress[progress.course_id] = {
            courseId: progress.course_id,
            completed: progress.progress_percentage === 100,
            completedChapters: progress.completed_chapters || [],
            totalChapters: courseConfig?.totalChapters || 0,
            progressPercentage: progress.progress_percentage || 0,
            completedAt: progress.completed_at ? new Date(progress.completed_at) : undefined,
            xpEarned: progress.xp_earned || 0
          };
        });

        return {
          completedCourses: userStats?.completed_courses || [],
          unlockedCourses: userStats?.unlocked_courses || ['foundation'],
          totalXP: userStats?.total_xp || 0,
          currentLevel: userStats?.level || 1,
          courseProgress
        } as UserProgressData;
      } catch (error) {
        console.error('Database error, falling back to defaults:', error);
        return {
          completedCourses: [],
          unlockedCourses: ['foundation'],
          totalXP: 0,
          currentLevel: 1,
          courseProgress: {}
        };
      }
    },
    enabled: true,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  // Mutation to update chapter progress and handle course completion
  const updateChapterProgressMutation = useMutation({
    mutationFn: async ({ courseId, chapterId, totalChapters }: {
      courseId: string;
      chapterId: string;
      totalChapters?: number;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const courseConfig = COURSE_PROGRESSION[courseId as keyof typeof COURSE_PROGRESSION];
      if (!courseConfig) throw new Error('Invalid course ID');

      const chaptersCount = totalChapters || courseConfig.totalChapters;
      
      // Get current progress
      const { data: currentProgress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();

      const completedChapters = currentProgress?.completed_chapters || [];
      
      // Add new chapter if not already completed
      if (!completedChapters.includes(chapterId)) {
        const newCompletedChapters = [...completedChapters, chapterId];
        const progressPercentage = Math.round((newCompletedChapters.length / chaptersCount) * 100);
        const isCompleted = progressPercentage === 100;
        const xpEarned = isCompleted ? courseConfig.xpReward : 0;

        // Update progress in database
        const { error } = await supabase
          .from('user_progress')
          .upsert({
            user_id: user.id,
            course_id: courseId,
            progress_percentage: progressPercentage,
            completed_chapters: newCompletedChapters,
            xp_earned: xpEarned,
            completed_at: isCompleted ? new Date().toISOString() : null,
            updated_at: new Date().toISOString()
          });

        if (error) throw error;

        // If course is completed, update user stats
        if (isCompleted) {
          const { data: currentStats } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', user.id)
            .single();

          const completedCourses = currentStats?.completed_courses || [];
          const unlockedCourses = currentStats?.unlocked_courses || ['foundation'];
          const currentXP = currentStats?.total_xp || 0;
          
          // Add course to completed if not already there
          if (!completedCourses.includes(courseId)) {
            const newCompletedCourses = [...completedCourses, courseId];
            
            // Unlock next courses
            const coursesToUnlock = courseConfig.unlocks || [];
            const newUnlockedCourses = [...new Set([...unlockedCourses, ...coursesToUnlock])];
            
            // Calculate new level (every 1000 XP = 1 level)
            const newTotalXP = currentXP + xpEarned;
            const newLevel = Math.floor(newTotalXP / 1000) + 1;

            await supabase
              .from('user_stats')
              .upsert({
                user_id: user.id,
                completed_courses: newCompletedCourses,
                unlocked_courses: newUnlockedCourses,
                total_xp: newTotalXP,
                level: newLevel,
                updated_at: new Date().toISOString()
              });
          }
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-progression'] });
    },
  });

  // Helper functions
  const isCourseUnlocked = (courseId: string): boolean => {
    return userProgress?.unlockedCourses.includes(courseId) || false;
  };

  const isCourseCompleted = (courseId: string): boolean => {
    return userProgress?.completedCourses.includes(courseId) || false;
  };

  const getCourseProgress = (courseId: string): CourseProgress | null => {
    return userProgress?.courseProgress[courseId] || null;
  };

  const updateChapterProgress = (courseId: string, chapterId: string, totalChapters?: number) => {
    updateChapterProgressMutation.mutate({ courseId, chapterId, totalChapters });
  };

  const getNextRecommendedCourse = (currentCourseId?: string): string | null => {
    if (!userProgress) return 'foundation';

    // If a current course is provided, get its unlocks
    if (currentCourseId) {
      const currentCourse = COURSE_PROGRESSION[currentCourseId as keyof typeof COURSE_PROGRESSION];
      if (currentCourse && currentCourse.unlocks) {
        for (const nextCourseId of currentCourse.unlocks) {
          if (isCourseUnlocked(nextCourseId) && !isCourseCompleted(nextCourseId)) {
            return nextCourseId;
          }
        }
      }
    }

    // Find the first unlocked course that's not completed
    for (const [courseId, courseConfig] of Object.entries(COURSE_PROGRESSION)) {
      if (isCourseUnlocked(courseId) && !isCourseCompleted(courseId)) {
        return courseId;
      }
    }

    return null;
  };

  const unlockCourse = async (courseId: string) => {
    if (!user) return;

    const { data: currentStats } = await supabase
      .from('user_stats')
      .select('unlocked_courses')
      .eq('user_id', user.id)
      .single();

    const unlockedCourses = currentStats?.unlocked_courses || ['foundation'];
    
    if (!unlockedCourses.includes(courseId)) {
      const newUnlockedCourses = [...unlockedCourses, courseId];
      
      await supabase
        .from('user_stats')
        .update({ unlocked_courses: newUnlockedCourses })
        .eq('user_id', user.id);

      queryClient.invalidateQueries({ queryKey: ['course-progression'] });
    }
  };

  return {
    userProgress: userProgress || {
      completedCourses: [],
      unlockedCourses: ['foundation'],
      totalXP: 0,
      currentLevel: 1,
      courseProgress: {}
    },
    isLoading,
    courseProgression: COURSE_PROGRESSION,
    isCourseUnlocked,
    isCourseCompleted,
    getCourseProgress,
    updateChapterProgress,
    getNextRecommendedCourse,
    unlockCourse,
  };
};
