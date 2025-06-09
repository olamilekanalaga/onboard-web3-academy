
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
    unlocks: ['defi'],
    xpReward: 500,
    prerequisites: []
  },
  defi: {
    id: 'defi',
    title: 'DeFi Fundamentals',
    level: 'Beginner',
    category: 'defi',
    difficulty: 2,
    estimatedTime: '3-4 weeks',
    unlocks: ['degen'],
    xpReward: 750,
    prerequisites: ['foundation']
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
    prerequisites: ['defi']
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
    prerequisites: ['degen']
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
    prerequisites: ['advanced-trading']
  }
};

export const useCourseProgression = () => {
  const { user } = useAuth();
  const [userProgress, setUserProgress] = useState<UserProgressData>({
    completedCourses: [],
    unlockedCourses: ['foundation'], // Foundation is always unlocked
    totalXP: 0,
    currentLevel: 1,
    courseProgress: {}
  });

  // Load progress from localStorage
  useEffect(() => {
    if (user) {
      const savedProgress = localStorage.getItem(`course_progress_${user.id}`);
      if (savedProgress) {
        try {
          const parsed = JSON.parse(savedProgress);
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
    return userProgress.unlockedCourses.includes(courseId);
  };

  const isCourseCompleted = (courseId: string): boolean => {
    return userProgress.completedCourses.includes(courseId);
  };

  const getCourseProgress = (courseId: string): CourseProgress | null => {
    return userProgress.courseProgress[courseId] || null;
  };

  const updateChapterProgress = (courseId: string, chapterId: string, totalChapters: number) => {
    const currentProgress = userProgress.courseProgress[courseId] || {
      courseId,
      completed: false,
      completedChapters: [],
      totalChapters,
      progressPercentage: 0,
      xpEarned: 0
    };

    if (!currentProgress.completedChapters.includes(chapterId)) {
      const newCompletedChapters = [...currentProgress.completedChapters, chapterId];
      const progressPercentage = (newCompletedChapters.length / totalChapters) * 100;
      const isCompleted = progressPercentage === 100;

      const updatedProgress = {
        ...currentProgress,
        completedChapters: newCompletedChapters,
        progressPercentage,
        completed: isCompleted,
        completedAt: isCompleted ? new Date() : currentProgress.completedAt
      };

      const newUserProgress = {
        ...userProgress,
        courseProgress: {
          ...userProgress.courseProgress,
          [courseId]: updatedProgress
        }
      };

      // If course is completed, unlock next courses and award XP
      if (isCompleted && !userProgress.completedCourses.includes(courseId)) {
        const courseConfig = COURSE_PROGRESSION[courseId as keyof typeof COURSE_PROGRESSION];
        if (courseConfig) {
          newUserProgress.completedCourses = [...userProgress.completedCourses, courseId];
          newUserProgress.totalXP = userProgress.totalXP + courseConfig.xpReward;
          newUserProgress.currentLevel = Math.floor(newUserProgress.totalXP / 500) + 1;
          
          // Unlock next courses
          courseConfig.unlocks.forEach(nextCourseId => {
            if (!newUserProgress.unlockedCourses.includes(nextCourseId)) {
              newUserProgress.unlockedCourses = [...newUserProgress.unlockedCourses, nextCourseId];
            }
          });

          // Update XP earned for this course
          updatedProgress.xpEarned = courseConfig.xpReward;
        }
      }

      saveProgress(newUserProgress);
    }
  };

  const resetProgress = () => {
    const initialProgress: UserProgressData = {
      completedCourses: [],
      unlockedCourses: ['foundation'],
      totalXP: 0,
      currentLevel: 1,
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

  // Check if user has completed both degen and advanced-trading to unlock demos
  const isDemoUnlocked = (): boolean => {
    return isCourseCompleted('degen') && isCourseCompleted('advanced-trading');
  };

  return {
    userProgress,
    isCourseUnlocked,
    isCourseCompleted,
    getCourseProgress,
    updateChapterProgress,
    resetProgress,
    getNextUnlockedCourse,
    isDemoUnlocked,
    courseProgression: COURSE_PROGRESSION
  };
};
