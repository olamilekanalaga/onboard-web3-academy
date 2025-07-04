import { supabase } from '@/lib/supabase';

// Centralized data service to ensure consistency across all admin components
export class AdminDataService {
  private static instance: AdminDataService;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): AdminDataService {
    if (!AdminDataService.instance) {
      AdminDataService.instance = new AdminDataService();
    }
    return AdminDataService.instance;
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.CACHE_DURATION;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private getCache(key: string): any {
    const cached = this.cache.get(key);
    return cached?.data;
  }

  // Get all users with their profiles
  async getAllUsers() {
    const cacheKey = 'all_users';
    
    if (this.isCacheValid(cacheKey)) {
      console.log('📦 Using cached user data');
      return this.getCache(cacheKey);
    }

    try {
      console.log('🔄 Loading all users from database...');
      
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          display_name,
          email,
          country_code,
          country_name,
          created_at,
          updated_at
        `);

      if (error) {
        console.error('❌ Error loading users:', error);
        throw error;
      }

      console.log('✅ Loaded users:', profiles?.length || 0);
      this.setCache(cacheKey, profiles || []);
      return profiles || [];

    } catch (error) {
      console.error('❌ Error in getAllUsers:', error);
      return [];
    }
  }

  // Get user progress data
  async getUserProgress(userId?: string) {
    const cacheKey = userId ? `user_progress_${userId}` : 'all_user_progress';
    
    if (this.isCacheValid(cacheKey)) {
      console.log('📦 Using cached progress data');
      return this.getCache(cacheKey);
    }

    try {
      console.log('🔄 Loading user progress...');
      
      let query = supabase.from('user_progress').select('*');
      
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data: progress, error } = await query;

      if (error) {
        console.error('❌ Error loading user progress:', error);
        throw error;
      }

      console.log('✅ Loaded progress records:', progress?.length || 0);
      this.setCache(cacheKey, progress || []);
      return progress || [];

    } catch (error) {
      console.error('❌ Error in getUserProgress:', error);
      return [];
    }
  }

  // Get user stats
  async getUserStats(userId?: string) {
    const cacheKey = userId ? `user_stats_${userId}` : 'all_user_stats';
    
    if (this.isCacheValid(cacheKey)) {
      console.log('📦 Using cached stats data');
      return this.getCache(cacheKey);
    }

    try {
      console.log('🔄 Loading user stats...');
      
      let query = supabase.from('user_stats').select('*');
      
      if (userId) {
        query = query.eq('user_id', userId).single();
      }

      const { data: stats, error } = await query;

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error loading user stats:', error);
        throw error;
      }

      console.log('✅ Loaded stats records:', Array.isArray(stats) ? stats.length : (stats ? 1 : 0));
      this.setCache(cacheKey, stats || (userId ? null : []));
      return stats || (userId ? null : []);

    } catch (error) {
      console.error('❌ Error in getUserStats:', error);
      return userId ? null : [];
    }
  }

  // Get comprehensive user analytics
  async getComprehensiveUserAnalytics() {
    const cacheKey = 'comprehensive_analytics';
    
    if (this.isCacheValid(cacheKey)) {
      console.log('📦 Using cached comprehensive analytics');
      return this.getCache(cacheKey);
    }

    try {
      console.log('🔄 Loading comprehensive user analytics...');
      
      // Load all data in parallel
      const [users, allProgress, allStats] = await Promise.all([
        this.getAllUsers(),
        this.getUserProgress(),
        this.getUserStats()
      ]);

      // Process the data
      const courseList = [
        { id: 'foundation', name: 'Foundation Course', level: 'Beginner' },
        { id: 'defi-fundamentals', name: 'DeFi Fundamentals', level: 'Intermediate' },
        { id: 'degen', name: 'Degen Course', level: 'Advanced' },
        { id: 'advanced-trading', name: 'Advanced Trading', level: 'Advanced' },
        { id: 'development', name: 'Web3 Development', level: 'Advanced' },
        { id: 'nft-creation', name: 'NFT Creation', level: 'Intermediate' },
        { id: 'content-creation', name: 'Content Creation', level: 'Beginner' },
        { id: 'web3-security', name: 'Web3 Security', level: 'Advanced' },
        { id: 'dao-governance', name: 'DAO Governance', level: 'Intermediate' },
        { id: 'web3-gaming', name: 'Web3 Gaming', level: 'Intermediate' },
        { id: 'crypto-tax', name: 'Crypto Tax', level: 'Beginner' },
        { id: 'web3-social', name: 'Web3 Social', level: 'Intermediate' }
      ];

      // Create stats lookup
      const statsLookup = Array.isArray(allStats) 
        ? allStats.reduce((acc, stat) => {
            acc[stat.user_id] = stat;
            return acc;
          }, {} as Record<string, any>)
        : {};

      // Process each user
      const userAnalytics = users.map(user => {
        const userProgress = allProgress.filter(p => p.user_id === user.id);
        const userStats = statsLookup[user.id];
        
        const completedCourses = userProgress.filter(p => p.progress_percentage >= 100).length;
        const inProgressCourses = userProgress.filter(p => p.progress_percentage > 0 && p.progress_percentage < 100).length;
        const totalXP = userStats?.total_xp || 0;
        const completionRate = courseList.length > 0 ? (completedCourses / courseList.length) * 100 : 0;

        // Determine user level
        let level = 'Beginner';
        if (completedCourses >= 8) level = 'Expert';
        else if (completedCourses >= 5) level = 'Advanced';
        else if (completedCourses >= 2) level = 'Intermediate';

        return {
          user_id: user.id,
          username: user.username || 'Unknown',
          display_name: user.display_name || user.username || 'Unknown User',
          email: user.email || 'No email',
          country: user.country_name || 'Unknown',
          country_code: user.country_code || 'XX',
          total_courses: courseList.length,
          completed_courses: completedCourses,
          in_progress_courses: inProgressCourses,
          total_xp: totalXP,
          completion_rate: Math.round(completionRate),
          level,
          last_activity: userProgress.length > 0 
            ? userProgress.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0].updated_at
            : user.created_at,
          course_details: userProgress,
          created_at: user.created_at
        };
      });

      // Calculate summary statistics
      const analytics = {
        users: userAnalytics,
        summary: {
          totalUsers: users.length,
          totalCompletions: userAnalytics.reduce((sum, user) => sum + user.completed_courses, 0),
          averageCompletionRate: users.length > 0 
            ? Math.round(userAnalytics.reduce((sum, user) => sum + user.completion_rate, 0) / users.length)
            : 0,
          totalXPAwarded: userAnalytics.reduce((sum, user) => sum + user.total_xp, 0)
        },
        courseStats: courseList.map(course => {
          const courseProgress = allProgress.filter(p => p.course_id === course.id);
          const enrollments = courseProgress.length;
          const completions = courseProgress.filter(p => p.progress_percentage >= 100).length;
          
          return {
            course_id: course.id,
            course_name: course.name,
            total_enrollments: enrollments,
            completions,
            completion_rate: enrollments > 0 ? Math.round((completions / enrollments) * 100) : 0,
            difficulty_rating: course.level === 'Beginner' ? 2 : course.level === 'Intermediate' ? 3 : 4
          };
        }),
        countryStats: this.processCountryStats(users)
      };

      console.log('✅ Processed comprehensive analytics:', {
        users: analytics.users.length,
        courses: analytics.courseStats.length,
        countries: analytics.countryStats.length
      });

      this.setCache(cacheKey, analytics);
      return analytics;

    } catch (error) {
      console.error('❌ Error in getComprehensiveUserAnalytics:', error);
      return {
        users: [],
        summary: { totalUsers: 0, totalCompletions: 0, averageCompletionRate: 0, totalXPAwarded: 0 },
        courseStats: [],
        countryStats: []
      };
    }
  }

  private processCountryStats(users: any[]) {
    const countryGroups: { [key: string]: { count: number, code: string } } = {};
    
    users.forEach(user => {
      const countryName = user.country_name || 'Unknown';
      const countryCode = user.country_code || 'XX';
      
      if (!countryGroups[countryName]) {
        countryGroups[countryName] = { count: 0, code: countryCode };
      }
      countryGroups[countryName].count++;
    });

    return Object.entries(countryGroups)
      .map(([countryName, data]) => ({
        country_name: countryName,
        country_code: data.code,
        user_count: data.count,
        active_users: data.count, // Assume all users are active
        percentage: users.length > 0 ? Math.round((data.count / users.length) * 100) : 0
      }))
      .sort((a, b) => b.user_count - a.user_count);
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
    console.log('🗑️ Cache cleared');
  }

  // Force refresh data
  async refreshData() {
    this.clearCache();
    return await this.getComprehensiveUserAnalytics();
  }
}

// Export singleton instance
export const adminDataService = AdminDataService.getInstance();
