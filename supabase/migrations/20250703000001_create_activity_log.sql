-- Create user activity log table for streak tracking
CREATE TABLE IF NOT EXISTS user_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('course_completion', 'chapter_completion', 'quiz_completion', 'login')),
  activity_date DATE NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_id ON user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_date ON user_activity_log(activity_date);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_date ON user_activity_log(user_id, activity_date);

-- Create unique constraint to prevent duplicate activities per day
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_activity_log_unique_daily 
ON user_activity_log(user_id, activity_date);

-- Enable RLS
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own activity log" ON user_activity_log
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity log" ON user_activity_log
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to automatically update streaks when activity is logged
CREATE OR REPLACE FUNCTION update_user_streaks()
RETURNS TRIGGER AS $$
DECLARE
  current_streak_count INTEGER := 0;
  longest_streak_count INTEGER := 0;
  check_date DATE;
  activity_exists BOOLEAN;
BEGIN
  -- Calculate current streak
  check_date := NEW.activity_date;
  
  -- Count consecutive days backwards from the activity date
  LOOP
    SELECT EXISTS(
      SELECT 1 FROM user_activity_log 
      WHERE user_id = NEW.user_id 
      AND activity_date = check_date
    ) INTO activity_exists;
    
    IF activity_exists THEN
      current_streak_count := current_streak_count + 1;
      check_date := check_date - INTERVAL '1 day';
    ELSE
      EXIT;
    END IF;
  END LOOP;
  
  -- Get current longest streak from user_stats
  SELECT COALESCE(longest_streak, 0) INTO longest_streak_count
  FROM user_stats 
  WHERE user_id = NEW.user_id;
  
  -- Update longest streak if current is longer
  IF current_streak_count > longest_streak_count THEN
    longest_streak_count := current_streak_count;
  END IF;
  
  -- Update user_stats
  INSERT INTO user_stats (
    user_id, 
    current_streak, 
    longest_streak, 
    last_activity_date,
    total_xp,
    level,
    completed_courses,
    unlocked_courses,
    achievements,
    total_study_time,
    updated_at
  ) VALUES (
    NEW.user_id,
    current_streak_count,
    longest_streak_count,
    NEW.activity_date::timestamp,
    0,
    1,
    '[]'::jsonb,
    '["foundation"]'::jsonb,
    '[]'::jsonb,
    0,
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    current_streak = current_streak_count,
    longest_streak = GREATEST(user_stats.longest_streak, longest_streak_count),
    last_activity_date = NEW.activity_date::timestamp,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update streaks
DROP TRIGGER IF EXISTS trigger_update_user_streaks ON user_activity_log;
CREATE TRIGGER trigger_update_user_streaks
  AFTER INSERT ON user_activity_log
  FOR EACH ROW
  EXECUTE FUNCTION update_user_streaks();

-- Function to get user streak data
CREATE OR REPLACE FUNCTION get_user_streak_data(p_user_id UUID)
RETURNS TABLE (
  current_streak INTEGER,
  longest_streak INTEGER,
  last_activity_date TIMESTAMP,
  streak_status TEXT,
  days_active_this_month INTEGER
) AS $$
DECLARE
  last_activity TIMESTAMP;
  current_streak_val INTEGER := 0;
  longest_streak_val INTEGER := 0;
  status TEXT := 'new';
  days_active INTEGER := 0;
BEGIN
  -- Get basic stats
  SELECT 
    us.current_streak,
    us.longest_streak,
    us.last_activity_date
  INTO current_streak_val, longest_streak_val, last_activity
  FROM user_stats us
  WHERE us.user_id = p_user_id;
  
  -- If no stats found, return defaults
  IF NOT FOUND THEN
    current_streak_val := 0;
    longest_streak_val := 0;
    last_activity := NULL;
    status := 'new';
  ELSE
    -- Determine streak status
    IF current_streak_val > 0 THEN
      -- Check if streak is still active (within 36 hours)
      IF last_activity IS NOT NULL AND 
         last_activity >= NOW() - INTERVAL '36 hours' THEN
        status := 'active';
      ELSE
        status := 'broken';
        current_streak_val := 0; -- Reset current streak if broken
      END IF;
    ELSE
      status := 'new';
    END IF;
  END IF;
  
  -- Count days active this month
  SELECT COUNT(DISTINCT activity_date) INTO days_active
  FROM user_activity_log
  WHERE user_id = p_user_id
  AND activity_date >= DATE_TRUNC('month', CURRENT_DATE);
  
  RETURN QUERY SELECT 
    current_streak_val,
    longest_streak_val,
    last_activity,
    status,
    days_active;
END;
$$ LANGUAGE plpgsql;
