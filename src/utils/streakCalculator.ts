// Streak calculation utilities for Academia
// Properly calculates user learning streaks based on activity

export interface ActivityRecord {
  date: string; // ISO date string
  hasActivity: boolean;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  streakStatus: 'active' | 'broken' | 'new';
}

/**
 * Calculate current and longest streak from activity data
 */
export const calculateStreaks = (activityRecords: ActivityRecord[]): StreakData => {
  if (!activityRecords || activityRecords.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      streakStatus: 'new'
    };
  }

  // Sort activities by date (newest first)
  const sortedActivities = activityRecords
    .filter(record => record.hasActivity)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sortedActivities.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      streakStatus: 'new'
    };
  }

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const lastActivityDate = sortedActivities[0].date;
  const lastActivity = new Date(lastActivityDate);

  // Check if streak is still active (activity today or yesterday)
  const isToday = isSameDay(lastActivity, today);
  const isYesterday = isSameDay(lastActivity, yesterday);
  const isActive = isToday || isYesterday;

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Calculate current streak (only if active)
  if (isActive) {
    let checkDate = new Date(today);
    if (!isToday) {
      checkDate = new Date(yesterday);
    }

    for (let i = 0; i < sortedActivities.length; i++) {
      const activityDate = new Date(sortedActivities[i].date);
      
      if (isSameDay(activityDate, checkDate)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (isConsecutiveDay(activityDate, checkDate)) {
        currentStreak++;
        checkDate = new Date(activityDate);
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  tempStreak = 1;
  for (let i = 1; i < sortedActivities.length; i++) {
    const currentDate = new Date(sortedActivities[i].date);
    const previousDate = new Date(sortedActivities[i - 1].date);
    
    if (isConsecutiveDay(currentDate, previousDate)) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  // Determine streak status
  let streakStatus: 'active' | 'broken' | 'new' = 'new';
  if (currentStreak > 0) {
    streakStatus = 'active';
  } else if (sortedActivities.length > 0) {
    streakStatus = 'broken';
  }

  return {
    currentStreak,
    longestStreak,
    lastActivityDate,
    streakStatus
  };
};

/**
 * Check if two dates are the same day
 */
const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

/**
 * Check if date1 is exactly one day before date2
 */
const isConsecutiveDay = (date1: Date, date2: Date): boolean => {
  const nextDay = new Date(date1);
  nextDay.setDate(nextDay.getDate() + 1);
  return isSameDay(nextDay, date2);
};

/**
 * Record activity for today and update streak
 */
export const recordTodayActivity = async (
  userId: string,
  activityType: 'course_completion' | 'chapter_completion' | 'quiz_completion' | 'app_usage'
): Promise<StreakData> => {
  const today = new Date().toISOString().split('T')[0];
  
  // This would typically interact with your database
  // For now, we'll return a calculated result
  
  // In a real implementation, you would:
  // 1. Record the activity in the database
  // 2. Fetch all user activities
  // 3. Calculate the new streak
  // 4. Update user_stats table
  
  return {
    currentStreak: 1,
    longestStreak: 1,
    lastActivityDate: today,
    streakStatus: 'active'
  };
};

/**
 * Get streak bonus XP based on current streak
 */
export const getStreakBonusXP = (currentStreak: number): number => {
  if (currentStreak < 3) return 0;
  if (currentStreak < 7) return 10;
  if (currentStreak < 14) return 25;
  if (currentStreak < 30) return 50;
  if (currentStreak < 60) return 100;
  return 200; // 60+ day streak
};

/**
 * Get streak badge info
 */
export const getStreakBadge = (currentStreak: number) => {
  if (currentStreak >= 365) {
    return { emoji: '👑', title: 'Legendary', color: 'bg-purple-500' };
  } else if (currentStreak >= 100) {
    return { emoji: '🏆', title: 'Champion', color: 'bg-yellow-500' };
  } else if (currentStreak >= 60) {
    return { emoji: '🔥', title: 'Fire', color: 'bg-red-500' };
  } else if (currentStreak >= 30) {
    return { emoji: '⚡', title: 'Lightning', color: 'bg-orange-500' };
  } else if (currentStreak >= 14) {
    return { emoji: '✨', title: 'Sparkling', color: 'bg-blue-500' };
  } else if (currentStreak >= 7) {
    return { emoji: '📚', title: 'Scholar', color: 'bg-green-500' };
  } else if (currentStreak >= 3) {
    return { emoji: '🌱', title: 'Growing', color: 'bg-emerald-500' };
  } else {
    return { emoji: '🎯', title: 'Starting', color: 'bg-gray-500' };
  }
};

/**
 * Generate activity records from user progress data
 */
export const generateActivityRecords = (userProgressData: any[]): ActivityRecord[] => {
  const activityMap = new Map<string, boolean>();
  
  // Process course completions
  userProgressData.forEach(progress => {
    if (progress.completed_at) {
      const date = new Date(progress.completed_at).toISOString().split('T')[0];
      activityMap.set(date, true);
    }
    
    // Process chapter completions (if available)
    if (progress.completed_chapters && Array.isArray(progress.completed_chapters)) {
      progress.completed_chapters.forEach((chapter: any) => {
        if (chapter.completed_at) {
          const date = new Date(chapter.completed_at).toISOString().split('T')[0];
          activityMap.set(date, true);
        }
      });
    }
  });
  
  // Convert to array
  return Array.from(activityMap.entries()).map(([date, hasActivity]) => ({
    date,
    hasActivity
  }));
};

/**
 * Check if user should maintain streak (grace period)
 */
export const hasStreakGracePeriod = (lastActivityDate: string): boolean => {
  const lastActivity = new Date(lastActivityDate);
  const now = new Date();
  const hoursDiff = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);
  
  // 36-hour grace period (allows for different time zones and late night learning)
  return hoursDiff <= 36;
};

/**
 * Get motivational message based on streak status
 */
export const getStreakMessage = (streakData: StreakData): string => {
  const { currentStreak, streakStatus } = streakData;
  
  if (streakStatus === 'active') {
    if (currentStreak === 1) {
      return "Great start! Keep learning tomorrow to build your streak! 🌟";
    } else if (currentStreak < 7) {
      return `${currentStreak} days strong! You're building momentum! 🚀`;
    } else if (currentStreak < 30) {
      return `Amazing ${currentStreak}-day streak! You're on fire! 🔥`;
    } else {
      return `Incredible ${currentStreak}-day streak! You're a learning legend! 👑`;
    }
  } else if (streakStatus === 'broken') {
    return "Your streak ended, but every expert was once a beginner. Start fresh today! 💪";
  } else {
    return "Ready to start your learning journey? Complete a lesson to begin your streak! 🎯";
  }
};
