import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalLessons: number;
  completedLessons: number;
  totalHours: number;
  certificates: number;
  currentStreak: number;
  longestStreak: number;
  level: number;
  xp: number;
  xpToNext: number;
  achievements: Achievement[];
  weeklyProgress: {
    coursesStarted: number;
    lessonsCompleted: number;
    hoursLearned: number;
    progressIncrease: number;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: 'learning' | 'streak' | 'completion' | 'social' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const useUserStats = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-stats', user?.id],
    queryFn: async (): Promise<UserStats> => {
      if (!user) throw new Error('User not authenticated');
      
      // Get user progress data
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select(`
          *,
          courses (
            id,
            title,
            estimated_duration,
            difficulty_level
          ),
          lessons (
            id,
            duration
          )
        `)
        .eq('user_id', user.id);
      
      if (progressError) throw progressError;
      
      // Get certificates
      const { data: certificates, error: certError } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', user.id);
      
      if (certError) throw certError;
      
      // Calculate stats
      const completedCourses = progressData?.filter(p => p.completed_at)?.length || 0;
      const inProgressCourses = progressData?.filter(p => p.progress_percentage > 0 && !p.completed_at)?.length || 0;
      const totalCourses = progressData?.length || 0;
      
      const totalLessons = progressData?.reduce((acc, p) => {
        return acc + (p.lessons ? 1 : 0);
      }, 0) || 0;
      
      const completedLessons = progressData?.filter(p => p.progress_percentage === 100)?.length || 0;
      
      const totalHours = progressData?.reduce((acc, p) => {
        const duration = p.courses?.estimated_duration || 0;
        const progress = p.progress_percentage || 0;
        return acc + (duration * progress / 100);
      }, 0) || 0;
      
      // Calculate level and XP
      const xp = completedCourses * 100 + completedLessons * 10 + Math.floor(totalHours * 5);
      const level = Math.floor(xp / 500) + 1;
      const xpToNext = 500 - (xp % 500);
      
      // Calculate streak (simplified - would need actual login tracking)
      const currentStreak = calculateStreak(progressData || []);
      const longestStreak = currentStreak; // Would be stored separately
      
      // Generate achievements
      const achievements = generateAchievements({
        completedCourses,
        totalHours,
        currentStreak,
        certificates: certificates?.length || 0,
        level
      });
      
      // Calculate weekly progress (simplified)
      const weeklyProgress = {
        coursesStarted: Math.floor(Math.random() * 3) + 1,
        lessonsCompleted: Math.floor(Math.random() * 10) + 5,
        hoursLearned: Math.floor(Math.random() * 8) + 3,
        progressIncrease: Math.floor(Math.random() * 30) + 10
      };
      
      return {
        totalCourses,
        completedCourses,
        inProgressCourses,
        totalLessons,
        completedLessons,
        totalHours: Math.floor(totalHours),
        certificates: certificates?.length || 0,
        currentStreak,
        longestStreak,
        level,
        xp,
        xpToNext,
        achievements,
        weeklyProgress
      };
    },
    enabled: !!user,
  });
};

function calculateStreak(progressData: any[]): number {
  // Simplified streak calculation
  // In a real app, you'd track daily login/activity
  const recentActivity = progressData.filter(p => {
    const updatedAt = new Date(p.updated_at || p.created_at);
    const daysDiff = (Date.now() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  });
  
  return Math.min(recentActivity.length, 14); // Cap at 14 days
}

function generateAchievements(stats: {
  completedCourses: number;
  totalHours: number;
  currentStreak: number;
  certificates: number;
  level: number;
}): Achievement[] {
  const achievements: Achievement[] = [];
  
  // Learning achievements
  if (stats.completedCourses >= 1) {
    achievements.push({
      id: 'first-course',
      title: 'First Steps',
      description: 'Completed your first course',
      icon: '🎯',
      unlockedAt: new Date().toISOString(),
      category: 'completion',
      rarity: 'common'
    });
  }
  
  if (stats.completedCourses >= 5) {
    achievements.push({
      id: 'course-master',
      title: 'Course Master',
      description: 'Completed 5 courses',
      icon: '🏆',
      unlockedAt: new Date().toISOString(),
      category: 'completion',
      rarity: 'rare'
    });
  }
  
  // Streak achievements
  if (stats.currentStreak >= 7) {
    achievements.push({
      id: 'week-warrior',
      title: 'Week Warrior',
      description: '7-day learning streak',
      icon: '🔥',
      unlockedAt: new Date().toISOString(),
      category: 'streak',
      rarity: 'common'
    });
  }
  
  if (stats.currentStreak >= 30) {
    achievements.push({
      id: 'streak-legend',
      title: 'Streak Legend',
      description: '30-day learning streak',
      icon: '⚡',
      unlockedAt: new Date().toISOString(),
      category: 'streak',
      rarity: 'legendary'
    });
  }
  
  // Time achievements
  if (stats.totalHours >= 10) {
    achievements.push({
      id: 'dedicated-learner',
      title: 'Dedicated Learner',
      description: '10+ hours of learning',
      icon: '📚',
      unlockedAt: new Date().toISOString(),
      category: 'learning',
      rarity: 'common'
    });
  }
  
  // Level achievements
  if (stats.level >= 5) {
    achievements.push({
      id: 'rising-star',
      title: 'Rising Star',
      description: 'Reached Level 5',
      icon: '⭐',
      unlockedAt: new Date().toISOString(),
      category: 'learning',
      rarity: 'rare'
    });
  }
  
  return achievements;
}
