-- Simplified Web3 Academy Schema (No Booking System)
-- Run this in Supabase SQL Editor

-- Countries table for user registration
CREATE TABLE IF NOT EXISTS countries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(3) NOT NULL UNIQUE,
  flag_emoji VARCHAR(10),
  timezone VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert popular countries
INSERT INTO countries (name, code, flag_emoji, timezone) VALUES
('United States', 'US', '🇺🇸', 'America/New_York'),
('United Kingdom', 'GB', '🇬🇧', 'Europe/London'),
('Canada', 'CA', '🇨🇦', 'America/Toronto'),
('Australia', 'AU', '🇦🇺', 'Australia/Sydney'),
('Germany', 'DE', '🇩🇪', 'Europe/Berlin'),
('France', 'FR', '🇫🇷', 'Europe/Paris'),
('Japan', 'JP', '🇯🇵', 'Asia/Tokyo'),
('Singapore', 'SG', '🇸🇬', 'Asia/Singapore'),
('India', 'IN', '🇮🇳', 'Asia/Kolkata'),
('Brazil', 'BR', '🇧🇷', 'America/Sao_Paulo'),
('Mexico', 'MX', '🇲🇽', 'America/Mexico_City'),
('Spain', 'ES', '🇪🇸', 'Europe/Madrid'),
('Italy', 'IT', '🇮🇹', 'Europe/Rome'),
('Netherlands', 'NL', '🇳🇱', 'Europe/Amsterdam'),
('Switzerland', 'CH', '🇨🇭', 'Europe/Zurich'),
('United Arab Emirates', 'AE', '🇦🇪', 'Asia/Dubai'),
('South Korea', 'KR', '🇰🇷', 'Asia/Seoul'),
('China', 'CN', '🇨🇳', 'Asia/Shanghai'),
('Russia', 'RU', '🇷🇺', 'Europe/Moscow'),
('South Africa', 'ZA', '🇿🇦', 'Africa/Johannesburg')
ON CONFLICT (code) DO NOTHING;

-- User profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  email TEXT,
  country_id INTEGER REFERENCES countries(id),
  timezone VARCHAR(50),
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User analytics table (simplified for basic tracking)
CREATE TABLE IF NOT EXISTS user_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  country_code VARCHAR(3),
  city VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course progress tracking
CREATE TABLE IF NOT EXISTS course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id VARCHAR(100) NOT NULL,
  lesson_id VARCHAR(100),
  completed BOOLEAN DEFAULT false,
  progress_percentage INTEGER DEFAULT 0,
  time_spent_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, course_id, lesson_id)
);

-- User achievements/gamification
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type VARCHAR(100) NOT NULL,
  achievement_data JSONB DEFAULT '{}',
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_country_id ON profiles(country_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id ON user_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_event_type ON user_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_user_analytics_created_at ON user_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_course_progress_user_id ON course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_course_id ON course_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Countries: Public read access
DROP POLICY IF EXISTS "Countries are publicly readable" ON countries;
CREATE POLICY "Countries are publicly readable" ON countries FOR SELECT USING (true);

-- Profiles: Users can view and update their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User analytics: Users can create their own analytics
DROP POLICY IF EXISTS "Users can create their own analytics" ON user_analytics;
CREATE POLICY "Users can create their own analytics" ON user_analytics FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Course progress: Users can manage their own progress
DROP POLICY IF EXISTS "Users can view own progress" ON course_progress;
CREATE POLICY "Users can view own progress" ON course_progress FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON course_progress;
CREATE POLICY "Users can update own progress" ON course_progress FOR ALL USING (auth.uid() = user_id);

-- User achievements: Users can view their own achievements
DROP POLICY IF EXISTS "Users can view own achievements" ON user_achievements;
CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own achievements" ON user_achievements;
CREATE POLICY "Users can insert own achievements" ON user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.countries TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT ALL ON public.user_analytics TO anon, authenticated;
GRANT ALL ON public.course_progress TO anon, authenticated;
GRANT ALL ON public.user_achievements TO anon, authenticated;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, email, country_id, timezone, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    NEW.email,
    CASE 
      WHEN NEW.raw_user_meta_data->>'country_id' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'country_id')::INTEGER 
      ELSE NULL 
    END,
    COALESCE(NEW.raw_user_meta_data->>'timezone', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to get user country stats
CREATE OR REPLACE FUNCTION get_user_country_stats()
RETURNS TABLE (
  country_name VARCHAR(100),
  country_code VARCHAR(3),
  flag_emoji VARCHAR(10),
  user_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.name,
    c.code,
    c.flag_emoji,
    COUNT(p.id) as user_count
  FROM countries c
  LEFT JOIN profiles p ON c.id = p.country_id
  GROUP BY c.id, c.name, c.code, c.flag_emoji
  ORDER BY user_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix any existing users without profiles
INSERT INTO public.profiles (id, full_name, avatar_url, email)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'full_name', ''),
  COALESCE(au.raw_user_meta_data->>'avatar_url', ''),
  au.email
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- Success message
SELECT 'Simplified Web3 Academy schema setup complete!' as status;
