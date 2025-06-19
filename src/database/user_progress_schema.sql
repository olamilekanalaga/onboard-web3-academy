-- User Progress Database Schema
-- This ensures course progress is saved to the database instead of localStorage

-- Create user_progress table if it doesn't exist
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

-- Create user_stats table for overall user statistics
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_course_id ON user_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_completed ON user_progress(user_id, completed_at);
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);

-- Enable Row Level Security
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_progress
CREATE POLICY IF NOT EXISTS "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_stats
CREATE POLICY IF NOT EXISTS "Users can view own stats" ON user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own stats" ON user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own stats" ON user_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to update user stats when progress changes
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
DECLARE
  completed_count INTEGER;
  total_xp INTEGER;
  new_level INTEGER;
  unlocked_courses JSONB;
BEGIN
  -- Calculate completed courses count
  SELECT COUNT(*) INTO completed_count
  FROM user_progress 
  WHERE user_id = NEW.user_id AND progress_percentage = 100;
  
  -- Calculate total XP
  SELECT COALESCE(SUM(xp_earned), 0) INTO total_xp
  FROM user_progress 
  WHERE user_id = NEW.user_id;
  
  -- Calculate level (500 XP per level)
  new_level := GREATEST(1, (total_xp / 500) + 1);
  
  -- Calculate unlocked courses based on completed courses
  -- This is a simplified version - you might want to implement more complex logic
  unlocked_courses := '["foundation"]'::jsonb;
  
  -- Upsert user stats
  INSERT INTO user_stats (
    user_id, 
    total_xp, 
    current_level, 
    completed_courses,
    unlocked_courses,
    updated_at
  ) VALUES (
    NEW.user_id,
    total_xp,
    new_level,
    (SELECT jsonb_agg(course_id) FROM user_progress WHERE user_id = NEW.user_id AND progress_percentage = 100),
    unlocked_courses,
    NOW()
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    total_xp = EXCLUDED.total_xp,
    current_level = EXCLUDED.current_level,
    completed_courses = EXCLUDED.completed_courses,
    unlocked_courses = EXCLUDED.unlocked_courses,
    updated_at = NOW();
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically update user stats
DROP TRIGGER IF EXISTS trigger_update_user_stats ON user_progress;
CREATE TRIGGER trigger_update_user_stats
  AFTER INSERT OR UPDATE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION update_user_stats();

-- Function to initialize user stats for new users
CREATE OR REPLACE FUNCTION initialize_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_stats (user_id, unlocked_courses)
  VALUES (NEW.id, '["foundation"]'::jsonb)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to initialize stats for new users
DROP TRIGGER IF EXISTS trigger_initialize_user_stats ON auth.users;
CREATE TRIGGER trigger_initialize_user_stats
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION initialize_user_stats();
