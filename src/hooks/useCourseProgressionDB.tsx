import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Course {
  id: string;
  title: string;
  level: string;
  xpRequired: number;
  xpReward: number;
  prerequisites: string[];
  unlocks: string[];
  estimatedTime: string;
  difficulty: number;
  description: string;
  keySkills: string[];
  realWorldApplication: string;
  industryRelevance: string;
}

interface CourseProgression {
  [courseId: string]: {
    id: string;
    title: string;
    level: string;
    xpRequired: number;
    xpReward: number;
    prerequisites: string[];
    unlocks: string[];
    estimatedTime: string;
    difficulty: number;
    description: string;
    keySkills: string[];
    realWorldApplication: string;
    industryRelevance: string;
  };
}

const courseProgression: CourseProgression = {
  foundation: {
    id: 'foundation',
    title: 'Crypto Foundation',
    level: 'Foundation',
    xpRequired: 0,
    xpReward: 500,
    prerequisites: [],
    unlocks: ['beginner'],
    estimatedTime: '2 weeks',
    difficulty: 1,
    description: 'Master the fundamentals of money and digital currency',
    keySkills: ['Financial Literacy', 'Blockchain Basics', 'Crypto Terminology'],
    realWorldApplication: 'Understand crypto news, make informed investment decisions',
    industryRelevance: 'Essential for any crypto career path'
  },
  beginner: {
    id: 'beginner',
    title: 'Cryptocurrency Fundamentals',
    level: 'Beginner',
    xpRequired: 500,
    xpReward: 750,
    prerequisites: ['foundation'],
    unlocks: ['intermediate'],
    estimatedTime: '2 weeks',
    difficulty: 2,
    description: 'Explore cryptocurrency types, exchanges, and basic trading',
    keySkills: ['Exchange Navigation', 'Portfolio Management', 'Risk Assessment'],
    realWorldApplication: 'Trade cryptocurrencies safely, build diversified portfolio',
    industryRelevance: 'Required for trading, investment, and DeFi participation'
  },
  intermediate: {
    id: 'intermediate',
    title: 'DeFi Fundamentals',
    level: 'Intermediate',
    xpRequired: 1250,
    xpReward: 1200,
    prerequisites: ['beginner'],
    unlocks: ['advanced'],
    estimatedTime: '4 weeks',
    difficulty: 3,
    description: 'Master decentralized finance protocols and yield strategies',
    keySkills: ['DeFi Protocols', 'Yield Farming', 'Liquidity Provision'],
    realWorldApplication: 'Earn yield on crypto assets, participate in DeFi ecosystem',
    industryRelevance: 'Core skill for DeFi analysts, protocol developers'
  },
  advanced: {
    id: 'advanced',
    title: 'Smart Contract Development',
    level: 'Advanced',
    xpRequired: 2450,
    xpReward: 1500,
    prerequisites: ['intermediate'],
    unlocks: ['expert'],
    estimatedTime: '4 weeks',
    difficulty: 4,
    description: 'Build decentralized applications and smart contracts',
    keySkills: ['Solidity Programming', 'dApp Development', 'Web3 Integration'],
    realWorldApplication: 'Build and deploy your own DeFi protocols and NFT projects',
    industryRelevance: 'High-demand skill for blockchain developers (avg. $150k+ salary)'
  },
  expert: {
    id: 'expert',
    title: 'Advanced Trading & Security',
    level: 'Expert',
    xpRequired: 3950,
    xpReward: 2000,
    prerequisites: ['advanced'],
    unlocks: [],
    estimatedTime: '4 weeks',
    difficulty: 5,
    description: 'Master institutional-level trading and security practices',
    keySkills: ['Advanced Trading', 'Security Auditing', 'Risk Management'],
    realWorldApplication: 'Professional trading, security consulting, institutional DeFi',
    industryRelevance: 'Expert-level skills for senior roles and consulting'
  },
  'defi-fundamentals': {
    id: 'defi-fundamentals',
    title: 'DeFi Demystified',
    level: 'Beginner',
    xpRequired: 750,
    xpReward: 800,
    prerequisites: ['foundation'],
    unlocks: [],
    estimatedTime: '2 weeks',
    difficulty: 2,
    description: 'Unlock the potential of decentralized finance',
    keySkills: ['Yield Farming', 'Liquidity Mining', 'DeFi Protocols'],
    realWorldApplication: 'Participate in DeFi with confidence',
    industryRelevance: 'Essential for blockchain enthusiasts'
  },
  degen: {
    id: 'degen',
    title: 'Degen Playbook',
    level: 'Intermediate',
    xpRequired: 1500,
    xpReward: 1000,
    prerequisites: ['defi-fundamentals'],
    unlocks: [],
    estimatedTime: '3 weeks',
    difficulty: 3,
    description: 'Navigate the high-stakes world of crypto trading',
    keySkills: ['Risk Management', 'Technical Analysis', 'Leverage Trading'],
    realWorldApplication: 'Make informed trading decisions',
    industryRelevance: 'For advanced crypto traders'
  },
  'advanced-trading': {
    id: 'advanced-trading',
    title: 'Advanced Trading Strategies',
    level: 'Advanced',
    xpRequired: 2500,
    xpReward: 1200,
    prerequisites: ['degen'],
    unlocks: [],
    estimatedTime: '4 weeks',
    difficulty: 4,
    description: 'Master advanced trading techniques',
    keySkills: ['Algorithmic Trading', 'Market Making', 'Arbitrage'],
    realWorldApplication: 'Maximize trading profits',
    industryRelevance: 'For professional traders'
  },
  development: {
    id: 'development',
    title: 'Web3 Development',
    level: 'Expert',
    xpRequired: 4000,
    xpReward: 1500,
    prerequisites: ['advanced'],
    unlocks: [],
    estimatedTime: '6 weeks',
    difficulty: 5,
    description: 'Build decentralized applications',
    keySkills: ['Smart Contracts', 'dApp Development', 'Blockchain Architecture'],
    realWorldApplication: 'Create innovative Web3 solutions',
    industryRelevance: 'For blockchain developers'
  },
  'content-creation': {
    id: 'content-creation',
    title: 'Web3 Content Creation',
    level: 'Beginner',
    xpRequired: 500,
    xpReward: 600,
    prerequisites: ['foundation'],
    unlocks: [],
    estimatedTime: '2 weeks',
    difficulty: 2,
    description: 'Create engaging content for the Web3 space',
    keySkills: ['Content Strategy', 'Community Engagement', 'Social Media Marketing'],
    realWorldApplication: 'Build a Web3 audience',
    industryRelevance: 'For content creators'
  },
  'nft-creation': {
    id: 'nft-creation',
    title: 'NFT Creation',
    level: 'Intermediate',
    xpRequired: 1200,
    xpReward: 900,
    prerequisites: ['content-creation'],
    unlocks: [],
    estimatedTime: '3 weeks',
    difficulty: 3,
    description: 'Design and launch your own NFTs',
    keySkills: ['Digital Art', 'Smart Contracts', 'Community Building'],
    realWorldApplication: 'Monetize your creativity',
    industryRelevance: 'For digital artists'
  },
  'web3-security': {
    id: 'web3-security',
    title: 'Web3 Security',
    level: 'Advanced',
    xpRequired: 2400,
    xpReward: 1100,
    prerequisites: ['development'],
    unlocks: [],
    estimatedTime: '4 weeks',
    difficulty: 4,
    description: 'Secure Web3 applications',
    keySkills: ['Smart Contract Auditing', 'Penetration Testing', 'Incident Response'],
    realWorldApplication: 'Protect Web3 assets',
    industryRelevance: 'For security experts'
  },
  'dao-governance': {
    id: 'dao-governance',
    title: 'DAO Governance',
    level: 'Intermediate',
    xpRequired: 1300,
    xpReward: 850,
    prerequisites: ['foundation'],
    unlocks: [],
    estimatedTime: '3 weeks',
    difficulty: 3,
    description: 'Participate in decentralized autonomous organizations',
    keySkills: ['Voting Mechanisms', 'Community Management', 'Proposal Writing'],
    realWorldApplication: 'Shape the future of Web3 projects',
    industryRelevance: 'For DAO contributors'
  },
  'web3-gaming': {
    id: 'web3-gaming',
    title: 'Web3 Gaming',
    level: 'Beginner',
    xpRequired: 600,
    xpReward: 700,
    prerequisites: ['foundation'],
    unlocks: [],
    estimatedTime: '2 weeks',
    difficulty: 2,
    description: 'Explore the world of blockchain gaming',
    keySkills: ['Game Mechanics', 'NFT Integration', 'Play-to-Earn'],
    realWorldApplication: 'Earn while playing games',
    industryRelevance: 'For gamers and developers'
  },
  'crypto-tax': {
    id: 'crypto-tax',
    title: 'Crypto Tax',
    level: 'Intermediate',
    xpRequired: 1400,
    xpReward: 950,
    prerequisites: ['foundation'],
    unlocks: [],
    estimatedTime: '3 weeks',
    difficulty: 3,
    description: 'Navigate the complexities of cryptocurrency taxation',
    keySkills: ['Tax Reporting', 'Compliance', 'Financial Planning'],
    realWorldApplication: 'Stay compliant with crypto tax laws',
    industryRelevance: 'For crypto investors'
  },
  'web3-social': {
    id: 'web3-social',
    title: 'Web3 Social',
    level: 'Beginner',
    xpRequired: 700,
    xpReward: 750,
    prerequisites: ['content-creation'],
    unlocks: [],
    estimatedTime: '2 weeks',
    difficulty: 2,
    description: 'Build decentralized social networks',
    keySkills: ['Community Building', 'Tokenomics', 'Decentralized Identity'],
    realWorldApplication: 'Create censorship-resistant social platforms',
    industryRelevance: 'For social media innovators'
  }
};

export const useCourseProgressionDB = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const userProgressQuery = useQuery({
    queryKey: ['user-progress', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data: userStats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (statsError) {
        console.error('Error fetching user stats:', statsError);
        throw statsError;
      }

      return {
        totalXP: userStats?.total_xp || 0,
        currentLevel: userStats?.level || 1,
        completedCourses: userStats?.completed_courses || [],
        unlockedCourses: userStats?.unlocked_courses || ['foundation'],
        streakDays: userStats?.current_streak || 0,
        achievements: userStats?.achievements || []
      };
    },
    enabled: !!user,
  });

  const updateChapterProgress = useMutation({
    mutationFn: async ({ courseId, chapterId, totalChapters }: {
      courseId: string;
      chapterId: string;
      totalChapters: number;
    }) => {
      if (!user) throw new Error('User not authenticated');

      console.log('Updating chapter progress:', { courseId, chapterId, totalChapters });

      // Get current progress
      const { data: currentProgress, error: fetchError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching current progress:', fetchError);
        throw fetchError;
      }

      let completedChapters = currentProgress?.completed_chapters || [];
      
      // Add chapter if not already completed
      if (!completedChapters.includes(chapterId)) {
        completedChapters = [...completedChapters, chapterId];
        console.log('Added chapter to completed list:', chapterId);
      }

      const progressPercentage = Math.round((completedChapters.length / totalChapters) * 100);
      const isCompleted = progressPercentage === 100;
      const courseConfig = courseProgression[courseId as keyof typeof courseProgression];
      
      console.log('Progress calculation:', {
        completedChapters: completedChapters.length,
        totalChapters,
        progressPercentage,
        isCompleted
      });

      // Update or insert progress record
      const progressData = {
        user_id: user.id,
        course_id: courseId,
        completed_chapters: completedChapters,
        progress_percentage: progressPercentage,
        completed_at: isCompleted ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      };

      const { data: updatedProgress, error: upsertError } = await supabase
        .from('user_progress')
        .upsert(progressData, { onConflict: 'user_id,course_id' })
        .select()
        .single();

      if (upsertError) {
        console.error('Error updating progress:', upsertError);
        throw upsertError;
      }

      console.log('Progress updated successfully:', updatedProgress);

      // If course completed, update user stats
      if (isCompleted && courseConfig) {
        console.log('Course completed, updating user stats...');
        
        const { data: currentStats, error: statsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (statsError) {
          console.error('Error fetching user stats:', statsError);
        } else {
          const completedCourses = currentStats.completed_courses || [];
          if (!completedCourses.includes(courseId)) {
            const newCompletedCourses = [...completedCourses, courseId];
            const newTotalXP = (currentStats.total_xp || 0) + courseConfig.xpReward;
            const newLevel = Math.floor(newTotalXP / 500) + 1;

            const { error: updateStatsError } = await supabase
              .from('user_stats')
              .update({
                completed_courses: newCompletedCourses,
                total_xp: newTotalXP,
                level: newLevel,
                last_activity_date: new Date().toISOString().split('T')[0],
                updated_at: new Date().toISOString()
              })
              .eq('user_id', user.id);

            if (updateStatsError) {
              console.error('Error updating user stats:', updateStatsError);
            } else {
              console.log('User stats updated successfully');
            }
          }
        }
      }

      return { 
        progress: updatedProgress, 
        completed: isCompleted,
        xpEarned: isCompleted && courseConfig ? courseConfig.xpReward : 0
      };
    },
    onSuccess: (data) => {
      console.log('Chapter progress mutation successful:', data);
      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      
      if (data.completed) {
        toast.success(`Course completed! +${data.xpEarned} XP earned!`);
      } else {
        toast.success('Chapter completed!');
      }
    },
    onError: (error) => {
      console.error('Error updating chapter progress:', error);
      toast.error('Failed to update progress. Please try again.');
    }
  });

  const getCourseProgress = (courseId: string) => {
    const { data: userProgress } = userProgressQuery;
    if (!userProgress) return null;

    const totalChapters = Object.values(courses[courseId]?.modules || []).reduce((sum, module: any) => sum + module.chapters.length, 0);
    const completedChapters = [];

    return {
      courseId,
      progressPercentage: Math.round((completedChapters.length / totalChapters) * 100),
      completedChapters
    };
  };

  const isCourseUnlocked = (courseId: string) => {
    const { data: userProgress } = userProgressQuery;
    return userProgress?.unlockedCourses.includes(courseId);
  };

  const isCourseCompleted = (courseId: string) => {
    const { data: userProgress } = userProgressQuery;
    return userProgress?.completedCourses.includes(courseId);
  };

  const getNextRecommendedCourse = (): Course | undefined => {
    const { data: userProgress } = userProgressQuery;

    if (!userProgress) {
      return undefined;
    }

    // Find the first course that is not yet unlocked and whose prerequisites are met
    for (const courseId in courseProgression) {
      if (!userProgress.unlockedCourses.includes(courseId)) {
        const course = courseProgression[courseId];
        if (course.prerequisites.every(prerequisite => userProgress.completedCourses.includes(prerequisite))) {
          return course as Course;
        }
      }
    }

    return undefined;
  };

  return {
    userProgress: userProgressQuery.data || {
      totalXP: 0,
      currentLevel: 1,
      completedCourses: [],
      unlockedCourses: ['foundation'],
      streakDays: 0,
      achievements: []
    },
    isLoading: userProgressQuery.isLoading,
    courseProgression,
    updateChapterProgress: updateChapterProgress.mutateAsync,
    isUpdating: updateChapterProgress.isPending,
    getCourseProgress,
    isCourseUnlocked,
    isCourseCompleted,
    getNextRecommendedCourse
  };
};
