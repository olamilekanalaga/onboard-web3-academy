import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface QuizResult {
  courseId: string;
  score: number;
  passed: boolean;
  completedAt: string;
  xpEarned: number;
}

export interface QuizProgress {
  [courseId: string]: QuizResult;
}

export const useQuizProgress = () => {
  const { user } = useAuth();
  const [quizProgress, setQuizProgress] = useState<QuizProgress>({});
  const [loading, setLoading] = useState(true);

  // Load quiz progress from Supabase only
  useEffect(() => {
    if (user) {
      loadQuizProgressFromDB();
    }
  }, [user]);

  const loadQuizProgressFromDB = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', user.id)
        .eq('passed', true);

      if (error) throw error;

      const progress: QuizProgress = {};
      data?.forEach(result => {
        progress[result.course_id] = {
          courseId: result.course_id,
          score: result.score,
          passed: result.passed,
          completedAt: result.completed_at,
          xpEarned: result.xp_earned
        };
      });

      setQuizProgress(progress);
      setLoading(false);
    } catch (error) {
      console.error('Error loading quiz progress:', error);
      setLoading(false);
    }
  };

  // Record quiz completion
  const recordQuizCompletion = async (courseId: string, score: number, xpEarned: number) => {
    const passed = score >= 70; // 70% passing score
    const result: QuizResult = {
      courseId,
      score,
      passed,
      completedAt: new Date().toISOString(),
      xpEarned: passed ? xpEarned : 0
    };

    // Save to Supabase database only
    try {
      if (user) {
        await supabase
          .from('quiz_results')
          .upsert({
            user_id: user.id,
            course_id: courseId,
            score,
            passed,
            completed_at: result.completedAt,
            xp_earned: result.xpEarned
          });

        // Update local state
        const newProgress = {
          ...quizProgress,
          [courseId]: result
        };
        setQuizProgress(newProgress);
      }
    } catch (error) {
      console.error('Error saving quiz result to database:', error);
    }

    return result;
  };

  // Check if user has passed quiz for a course
  const hasPassedQuiz = (courseId: string): boolean => {
    const result = quizProgress[courseId];
    return result ? result.passed : false;
  };

  // Get quiz result for a course
  const getQuizResult = (courseId: string): QuizResult | null => {
    return quizProgress[courseId] || null;
  };

  // Check if user can access a course (must have passed previous course quiz)
  const canAccessCourse = (courseId: string, prerequisites: string[] = []): boolean => {
    // Foundation course is always accessible
    if (courseId === 'foundation') return true;

    // Check if all prerequisite course quizzes have been passed
    for (const prereq of prerequisites) {
      if (!hasPassedQuiz(prereq)) {
        return false;
      }
    }

    return true;
  };

  // Get all passed courses
  const getPassedCourses = (): string[] => {
    return Object.keys(quizProgress).filter(courseId => quizProgress[courseId].passed);
  };

  // Get total XP earned from quizzes
  const getTotalQuizXP = (): number => {
    return Object.values(quizProgress).reduce((total, result) => {
      return total + (result.passed ? result.xpEarned : 0);
    }, 0);
  };

  // Reset quiz progress (for testing)
  const resetQuizProgress = async () => {
    if (user) {
      try {
        await supabase
          .from('quiz_results')
          .delete()
          .eq('user_id', user.id);

        setQuizProgress({});
      } catch (error) {
        console.error('Error resetting quiz progress:', error);
      }
    }
  };

  return {
    quizProgress,
    loading,
    recordQuizCompletion,
    hasPassedQuiz,
    getQuizResult,
    canAccessCourse,
    getPassedCourses,
    getTotalQuizXP,
    resetQuizProgress
  };
};
