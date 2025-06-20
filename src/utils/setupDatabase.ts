import { supabase } from '@/integrations/supabase/client';

export const setupUserProgressTables = async () => {
  try {
    console.log('Setting up user progress tables...');

    // Create user_progress table
    const { error: progressTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS user_progress (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          course_id VARCHAR(100) NOT NULL,
          lesson_id VARCHAR(100),
          progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
          completed_chapters JSONB DEFAULT '[]',
          total_chapters INTEGER DEFAULT 0,
          xp_earned INTEGER DEFAULT 0,
          completed_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          
          UNIQUE(user_id, course_id)
        );
      `
    });

    if (progressTableError) {
      console.error('Error creating user_progress table:', progressTableError);
    } else {
      console.log('user_progress table created successfully');
    }

    // Create user_stats table
    const { error: statsTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS user_stats (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
          total_xp INTEGER DEFAULT 0,
          current_level INTEGER DEFAULT 1,
          completed_courses JSONB DEFAULT '[]',
          unlocked_courses JSONB DEFAULT '["foundation"]',
          current_streak INTEGER DEFAULT 0,
          longest_streak INTEGER DEFAULT 0,
          total_hours INTEGER DEFAULT 0,
          certificates INTEGER DEFAULT 0,
          achievements JSONB DEFAULT '[]',
          weekly_progress JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (statsTableError) {
      console.error('Error creating user_stats table:', statsTableError);
    } else {
      console.log('user_stats table created successfully');
    }

    // Enable RLS
    await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
        ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
      `
    });

    // Create RLS policies
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY IF NOT EXISTS "Users can view own progress" ON user_progress
          FOR SELECT USING (auth.uid() = user_id);

        CREATE POLICY IF NOT EXISTS "Users can insert own progress" ON user_progress
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        CREATE POLICY IF NOT EXISTS "Users can update own progress" ON user_progress
          FOR UPDATE USING (auth.uid() = user_id);

        CREATE POLICY IF NOT EXISTS "Users can view own stats" ON user_stats
          FOR SELECT USING (auth.uid() = user_id);

        CREATE POLICY IF NOT EXISTS "Users can insert own stats" ON user_stats
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        CREATE POLICY IF NOT EXISTS "Users can update own stats" ON user_stats
          FOR UPDATE USING (auth.uid() = user_id);
      `
    });

    console.log('Database setup completed successfully!');
    return { success: true };

  } catch (error) {
    console.error('Error setting up database:', error);
    return { success: false, error };
  }
};

// Function to initialize user stats for current user
export const initializeUserStats = async (userId: string) => {
  try {
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), 3000);
    });

    const initPromise = supabase
      .from('user_stats')
      .upsert({
        user_id: userId,
        unlocked_courses: ['foundation']
      }, {
        onConflict: 'user_id',
        ignoreDuplicates: true
      });

    const { error } = await Promise.race([initPromise, timeoutPromise]) as any;

    if (error) {
      // If table doesn't exist, that's okay - we'll use localStorage fallback
      if (error.code === '42P01') {
        console.log('user_stats table does not exist yet - using localStorage fallback');
        return { success: true, fallback: true };
      }
      console.log('Error initializing user stats (non-critical):', error);
      return { success: false, error };
    }

    console.log('User stats initialized successfully');
    return { success: true };
  } catch (error) {
    // Timeout or other error - not critical for auth flow
    console.log('Error initializing user stats (non-critical):', error);
    return { success: false, error };
  }
};
