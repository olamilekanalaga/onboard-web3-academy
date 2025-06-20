
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

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
  degen: {
    id: 'degen',
    title: 'Degen Trading Mastery',
    level: 'Intermediate',
    category: 'trading',
    difficulty: 3,
    estimatedTime: '4-6 weeks',
    unlocks: ['advanced-trading'],
    xpReward: 1000,
    prerequisites: ['defi-fundamentals'],
    totalChapters: 18
  },
  'content-creation': {
    id: 'content-creation',
    title: 'Web3 Content Creation Mastery',
    level: 'Intermediate',
    category: 'content',
    difficulty: 3,
    estimatedTime: '3-4 weeks',
    unlocks: ['nft-creation'],
    xpReward: 900,
    prerequisites: ['defi-fundamentals'],
    totalChapters: 14
  },
  'advanced-trading': {
    id: 'advanced-trading',
    title: 'Advanced Trading Strategies',
    level: 'Advanced',
    category: 'trading',
    difficulty: 4,
    estimatedTime: '5-7 weeks',
    unlocks: ['development'],
    xpReward: 1200,
    prerequisites: ['degen'],
    totalChapters: 12
  },
  'nft-creation': {
    id: 'nft-creation',
    title: 'NFT Creation & Marketing',
    level: 'Advanced',
    category: 'creation',
    difficulty: 4,
    estimatedTime: '4-5 weeks',
    unlocks: ['development'],
    xpReward: 1100,
    prerequisites: ['content-creation'],
    totalChapters: 10
  },
  development: {
    id: 'development',
    title: 'Blockchain Development',
    level: 'Expert',
    category: 'development',
    difficulty: 5,
    estimatedTime: '6-8 weeks',
    unlocks: [],
    xpReward: 1500,
    prerequisites: ['advanced-trading', 'nft-creation'],
    totalChapters: 15
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

// Helper function to calculate which courses should be unlocked based on completed courses
const calculateUnlockedCourses = (completedCourses: string[]): string[] => {
  const unlocked = new Set(['foundation']); // Foundation is always unlocked

  // Add all completed courses to unlocked
  completedCourses.forEach(courseId => unlocked.add(courseId));

  // For each completed course, unlock its dependent courses
  completedCourses.forEach(completedCourseId => {
    const courseConfig = COURSE_PROGRESSION[completedCourseId as keyof typeof COURSE_PROGRESSION];
    if (courseConfig && courseConfig.unlocks) {
      courseConfig.unlocks.forEach(unlockedCourseId => {
        // Check if all prerequisites for the unlocked course are met
        const unlockedCourseConfig = COURSE_PROGRESSION[unlockedCourseId as keyof typeof COURSE_PROGRESSION];
        if (unlockedCourseConfig) {
          const allPrerequisitesMet = unlockedCourseConfig.prerequisites.every(prereq =>
            completedCourses.includes(prereq)
          );
          if (allPrerequisitesMet) {
            unlocked.add(unlockedCourseId);
          }
        }
      });
    }
  });

  return Array.from(unlocked);
};

export const useCourseProgression = () => {
  const { user } = useAuth();
  
  // Initialize with only foundation course unlocked
  const [userProgress, setUserProgress] = useState<UserProgressData>({
    completedCourses: [], // No courses completed initially
    unlockedCourses: ['foundation'], // Only foundation unlocked initially
    totalXP: 0, // Start with 0 XP
    currentLevel: 1, // Start at level 1
    courseProgress: {}
  });

  // Load progress from database
  useEffect(() => {
    if (user) {
      loadProgressFromDatabase();
    }
  }, [user]);

  const loadProgressFromDatabase = async () => {
    if (!user) return;

    try {
      // Get user stats from database
      const { data: userStats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (statsError && statsError.code !== 'PGRST116') {
        console.error('Error loading user stats:', statsError);
        return;
      }

      // Get user progress from database
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('lesson_id', 'course_overall');

      if (progressError) {
        console.error('Error loading user progress:', progressError);
        return;
      }

      // Convert database data to our format
      const completedCourses = userStats?.completed_courses || [];
      const courseProgress: Record<string, CourseProgress> = {};

      // Build course progress from database records
      progressData?.forEach(record => {
        const courseId = record.course_id;
        const completedChapters = record.completed_chapters || [];
        const totalChapters = COURSE_PROGRESSION[courseId as keyof typeof COURSE_PROGRESSION]?.totalChapters || 0;
        const progressPercentage = totalChapters > 0 ? (completedChapters.length / totalChapters) * 100 : 0;

        courseProgress[courseId] = {
          courseId,
          completed: completedCourses.includes(courseId),
          completedChapters,
          totalChapters,
          progressPercentage,
          completedAt: record.completed_at ? new Date(record.completed_at) : undefined,
          xpEarned: record.xp_earned || 0
        };
      });

      const newProgress: UserProgressData = {
        completedCourses,
        unlockedCourses: calculateUnlockedCourses(completedCourses),
        totalXP: userStats?.total_xp || 0,
        currentLevel: userStats?.level || 1,
        courseProgress
      };

      setUserProgress(newProgress);
    } catch (error) {
      console.error('Error loading progress from database:', error);
    }
  };

  // Save progress to database
  const saveProgress = async (newProgress: UserProgressData) => {
    if (!user) return;

    try {
      // Update user stats
      await supabase
        .from('user_stats')
        .upsert({
          user_id: user.id,
          completed_courses: newProgress.completedCourses,
          total_xp: newProgress.totalXP,
          level: newProgress.currentLevel,
          unlocked_courses: newProgress.unlockedCourses,
          updated_at: new Date().toISOString()
        });

      // Update individual course progress
      for (const [courseId, progress] of Object.entries(newProgress.courseProgress)) {
        await supabase
          .from('user_progress')
          .upsert({
            user_id: user.id,
            course_id: courseId,
            lesson_id: 'course_overall', // Use a default lesson_id for course-level progress
            completed_chapters: progress.completedChapters,
            progress_percentage: Math.round(progress.progressPercentage),
            completed_at: progress.completedAt?.toISOString(),
            xp_earned: progress.xpEarned,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,course_id,lesson_id'
          });
      }

      setUserProgress(newProgress);
    } catch (error) {
      console.error('Error saving progress to database:', error);
      // Fallback to localStorage if database fails
      localStorage.setItem(`course_progress_${user.id}`, JSON.stringify(newProgress));
      setUserProgress(newProgress);
    }
  };

  const isCourseUnlocked = (courseId: string): boolean => {
    return userProgress.unlockedCourses.includes(courseId);
  };

  const isCourseCompleted = (courseId: string): boolean => {
    return userProgress.completedCourses.includes(courseId);
  };

  const getCourseProgress = (courseId: string): CourseProgress | null => {
    return userProgress.courseProgress[courseId] || null;
  };

  const getCourseCompletionStatus = (courseId: string): { completed: boolean; canRetake: boolean; completedAt?: Date } => {
    const isCompleted = isCourseCompleted(courseId);
    const progress = getCourseProgress(courseId);
    
    return {
      completed: isCompleted,
      canRetake: isCompleted,
      completedAt: progress?.completedAt
    };
  };

  const updateChapterProgress = async (courseId: string, chapterId: string, totalChapters?: number) => {
    const courseConfig = COURSE_PROGRESSION[courseId as keyof typeof COURSE_PROGRESSION];
    if (!courseConfig) return;

    const chaptersCount = totalChapters || courseConfig.totalChapters;
    
    const currentProgress = userProgress.courseProgress[courseId] || {
      courseId,
      completed: false,
      completedChapters: [],
      totalChapters: chaptersCount,
      progressPercentage: 0,
      xpEarned: 0
    };

    if (!currentProgress.completedChapters.includes(chapterId)) {
      const newCompletedChapters = [...currentProgress.completedChapters, chapterId];
      const progressPercentage = (newCompletedChapters.length / chaptersCount) * 100;
      const isCompleted = progressPercentage === 100;

      const updatedProgress = {
        ...currentProgress,
        completedChapters: newCompletedChapters,
        progressPercentage,
        completed: isCompleted,
        completedAt: isCompleted ? new Date() : currentProgress.completedAt,
        totalChapters: chaptersCount
      };

      const newUserProgress = {
        ...userProgress,
        courseProgress: {
          ...userProgress.courseProgress,
          [courseId]: updatedProgress
        }
      };

      // If course is completed, award XP and unlock new courses
      if (isCompleted && !userProgress.completedCourses.includes(courseId)) {
        newUserProgress.completedCourses = [...userProgress.completedCourses, courseId];
        newUserProgress.totalXP = userProgress.totalXP + courseConfig.xpReward;
        newUserProgress.currentLevel = Math.floor(newUserProgress.totalXP / 500) + 1;

        // Update XP earned for this course
        updatedProgress.xpEarned = courseConfig.xpReward;

        // Recalculate unlocked courses
        newUserProgress.unlockedCourses = calculateUnlockedCourses(newUserProgress.completedCourses);
      }

      await saveProgress(newUserProgress);
    }
  };

  const resetProgress = async () => {
    const initialProgress: UserProgressData = {
      completedCourses: [], // No courses completed
      unlockedCourses: ['foundation'], // Only foundation unlocked
      totalXP: 0,
      currentLevel: 1,
      courseProgress: {}
    };
    await saveProgress(initialProgress);
  };

  const getNextUnlockedCourse = (): string | null => {
    const allCourses = Object.keys(COURSE_PROGRESSION);
    return allCourses.find(courseId =>
      isCourseUnlocked(courseId) && !isCourseCompleted(courseId)
    ) || null;
  };

  const getNextRecommendedCourse = (completedCourseId?: string): string | null => {
    // If a course was just completed, find what it unlocks
    if (completedCourseId) {
      const completedCourseConfig = COURSE_PROGRESSION[completedCourseId as keyof typeof COURSE_PROGRESSION];
      if (completedCourseConfig && completedCourseConfig.unlocks.length > 0) {
        // Return the first unlocked course from what this course unlocks
        const nextCourse = completedCourseConfig.unlocks.find(courseId =>
          isCourseUnlocked(courseId) && !isCourseCompleted(courseId)
        );
        if (nextCourse) return nextCourse;
      }
    }

    // Otherwise, return any unlocked but not completed course
    return getNextUnlockedCourse();
  };

  // All demos are unlocked for testing
  const isDemoUnlocked = (): boolean => {
    return true;
  };

  // For testing purposes - complete a course manually
  const completeCourse = async (courseId: string) => {
    const courseConfig = COURSE_PROGRESSION[courseId as keyof typeof COURSE_PROGRESSION];
    if (!courseConfig) return;

    // Mark all chapters as completed
    const allChapters = Array.from({ length: courseConfig.totalChapters }, (_, i) => `chapter-${i + 1}`);
    
    const updatedProgress: CourseProgress = {
      courseId,
      completed: true,
      completedChapters: allChapters,
      totalChapters: courseConfig.totalChapters,
      progressPercentage: 100,
      completedAt: new Date(),
      xpEarned: courseConfig.xpReward
    };

    const newUserProgress = {
      ...userProgress,
      courseProgress: {
        ...userProgress.courseProgress,
        [courseId]: updatedProgress
      }
    };

    // Add to completed courses if not already there
    if (!userProgress.completedCourses.includes(courseId)) {
      newUserProgress.completedCourses = [...userProgress.completedCourses, courseId];
      newUserProgress.totalXP = userProgress.totalXP + courseConfig.xpReward;
      newUserProgress.currentLevel = Math.floor(newUserProgress.totalXP / 500) + 1;

      // Recalculate unlocked courses
      newUserProgress.unlockedCourses = calculateUnlockedCourses(newUserProgress.completedCourses);
    }

    await saveProgress(newUserProgress);
  };

  return {
    userProgress,
    isCourseUnlocked,
    isCourseCompleted,
    getCourseProgress,
    getCourseCompletionStatus,
    updateChapterProgress,
    resetProgress,
    getNextUnlockedCourse,
    getNextRecommendedCourse,
    isDemoUnlocked,
    completeCourse,
    courseProgression: COURSE_PROGRESSION
  };
};
