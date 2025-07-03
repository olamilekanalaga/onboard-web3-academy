import { supabase } from '@/integrations/supabase/client';

export const ensureDatabaseTables = async () => {
  try {
    console.log('🔧 Checking database tables...');
    
    // Test if user_progress table exists by trying a simple query
    const { data, error } = await supabase
      .from('user_progress')
      .select('id')
      .limit(1);
    
    if (error && error.code === '42P01') {
      console.log('❌ Database tables missing. Please run the setup script in Supabase SQL Editor.');
      console.log('📋 Copy and run this SQL script in your Supabase Dashboard → SQL Editor:');
      console.log(`
-- Quick Database Setup for Academia
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  completed_chapters TEXT[] DEFAULT '{}',
  progress_percentage INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date TIMESTAMP WITH TIME ZONE,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  completed_courses JSONB DEFAULT '[]',
  unlocked_courses JSONB DEFAULT '["foundation"]',
  achievements JSONB DEFAULT '[]',
  total_study_time INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  passed BOOLEAN NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own progress" ON user_progress
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own stats" ON user_stats
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own quiz results" ON quiz_results
FOR ALL USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_progress_user_course ON user_progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_course ON quiz_results(user_id, course_id);

SELECT 'Database setup completed!' as message;
      `);
      return false;
    }
    
    if (error) {
      console.error('Database error:', error);
      return false;
    }
    
    console.log('✅ Database tables are ready');
    return true;
  } catch (error) {
    console.error('Error checking database:', error);
    return false;
  }
};

export const createUserStatsIfNotExists = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_stats')
      .select('id')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code === 'PGRST116') {
      // User stats don't exist, create them
      const { error: insertError } = await supabase
        .from('user_stats')
        .insert({
          user_id: userId,
          current_streak: 0,
          longest_streak: 0,
          total_xp: 0,
          level: 1,
          completed_courses: [],
          unlocked_courses: ['foundation'],
          achievements: [],
          total_study_time: 0
        });
      
      if (insertError) {
        console.error('Error creating user stats:', insertError);
        return false;
      }
      
      console.log('✅ Created user stats for:', userId);
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Error in createUserStatsIfNotExists:', error);
    return false;
  }
};
