
import { useState, useEffect } from 'react';
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
  }
};

export const useCourseProgression = () => {
  const { user } = useAuth();
  
  // Initialize with all courses unlocked and some completed for demo purposes
  const [userProgress, setUserProgress] = useState<UserProgressData>({
    completedCourses: ['foundation', 'defi-fundamentals'], // Mark some as completed for demo
    unlockedCourses: ['foundation', 'defi-fundamentals', 'degen', 'content-creation', 'advanced-trading', 'nft-creation', 'development'], // All unlocked
    totalXP: 2500, // Some XP to show progression
    currentLevel: 6, // Higher level for demo
    courseProgress: {}
  });

  // Load progress from localStorage
  useEffect(() => {
    if (user) {
      const savedProgress = localStorage.getItem(`course_progress_${user.id}`);
      if (savedProgress) {
        try {
          const parsed = JSON.parse(savedProgress);
          // Ensure all courses are still unlocked even from saved data
          parsed.unlockedCourses = ['foundation', 'defi-fundamentals', 'degen', 'content-creation', 'advanced-trading', 'nft-creation', 'development'];
          setUserProgress(parsed);
        } catch (error) {
          console.error('Error loading course progress:', error);
        }
      }
    }
  }, [user]);

  // Save progress to localStorage
  const saveProgress = (newProgress: UserProgressData) => {
    if (user) {
      localStorage.setItem(`course_progress_${user.id}`, JSON.stringify(newProgress));
      setUserProgress(newProgress);
    }
  };

  const isCourseUnlocked = (courseId: string): boolean => {
    // All courses are unlocked for demo purposes
    return true;
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

  const updateChapterProgress = (courseId: string, chapterId: string, totalChapters?: number) => {
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

      // If course is completed, award XP
      if (isCompleted && !userProgress.completedCourses.includes(courseId)) {
        newUserProgress.completedCourses = [...userProgress.completedCourses, courseId];
        newUserProgress.totalXP = userProgress.totalXP + courseConfig.xpReward;
        newUserProgress.currentLevel = Math.floor(newUserProgress.totalXP / 500) + 1;
        
        // Update XP earned for this course
        updatedProgress.xpEarned = courseConfig.xpReward;
      }

      saveProgress(newUserProgress);
    }
  };

  const resetProgress = () => {
    const initialProgress: UserProgressData = {
      completedCourses: ['foundation', 'defi-fundamentals'], // Keep some completed for demo
      unlockedCourses: ['foundation', 'defi-fundamentals', 'degen', 'content-creation', 'advanced-trading', 'nft-creation', 'development'], // All unlocked
      totalXP: 2500,
      currentLevel: 6,
      courseProgress: {}
    };
    saveProgress(initialProgress);
  };

  const getNextUnlockedCourse = (): string | null => {
    const allCourses = Object.keys(COURSE_PROGRESSION);
    return allCourses.find(courseId => 
      isCourseUnlocked(courseId) && !isCourseCompleted(courseId)
    ) || null;
  };

  // All demos are unlocked for testing
  const isDemoUnlocked = (): boolean => {
    return true;
  };

  // For testing purposes - complete a course manually
  const completeCourse = (courseId: string) => {
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
    }

    saveProgress(newUserProgress);
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
    isDemoUnlocked,
    completeCourse,
    courseProgression: COURSE_PROGRESSION
  };
};
