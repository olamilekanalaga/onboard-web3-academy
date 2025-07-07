-- Enhanced Analytics Functions for Admin Dashboard
-- These functions provide comprehensive analytics for user behavior, progress, and platform metrics

-- Function to get comprehensive user analytics (NO BOOKINGS/REVENUE)
CREATE OR REPLACE FUNCTION get_comprehensive_user_analytics()
RETURNS TABLE (
  total_users BIGINT,
  active_users_today BIGINT,
  active_users_week BIGINT,
  active_users_month BIGINT,
  new_users_today BIGINT,
  new_users_week BIGINT,
  new_users_month BIGINT,
  avg_study_time NUMERIC,
  total_course_completions BIGINT,
  total_xp_earned BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM profiles)::BIGINT as total_users,
    (SELECT COUNT(DISTINCT user_id) FROM user_stats WHERE last_activity_date >= CURRENT_DATE)::BIGINT as active_users_today,
    (SELECT COUNT(DISTINCT user_id) FROM user_stats WHERE last_activity_date >= CURRENT_DATE - INTERVAL '7 days')::BIGINT as active_users_week,
    (SELECT COUNT(DISTINCT user_id) FROM user_stats WHERE last_activity_date >= CURRENT_DATE - INTERVAL '30 days')::BIGINT as active_users_month,
    (SELECT COUNT(*) FROM profiles WHERE created_at >= CURRENT_DATE)::BIGINT as new_users_today,
    (SELECT COUNT(*) FROM profiles WHERE created_at >= CURRENT_DATE - INTERVAL '7 days')::BIGINT as new_users_week,
    (SELECT COUNT(*) FROM profiles WHERE created_at >= CURRENT_DATE - INTERVAL '30 days')::BIGINT as new_users_month,
    (SELECT COALESCE(AVG(total_study_time), 0) FROM user_stats WHERE total_study_time > 0)::NUMERIC as avg_study_time,
    (SELECT COALESCE(SUM(array_length(completed_courses, 1)), 0) FROM user_stats WHERE completed_courses IS NOT NULL)::BIGINT as total_course_completions,
    (SELECT COALESCE(SUM(total_xp), 0) FROM user_stats)::BIGINT as total_xp_earned;
END;
$$ LANGUAGE plpgsql;

-- Function to get user growth analytics by period (REAL DATA ONLY)
CREATE OR REPLACE FUNCTION get_user_growth_analytics(period_type TEXT DEFAULT 'daily')
RETURNS TABLE (
  period_date DATE,
  new_users BIGINT,
  cumulative_users BIGINT,
  active_users BIGINT,
  retention_rate NUMERIC
) AS $$
BEGIN
  IF period_type = 'daily' THEN
    RETURN QUERY
    WITH daily_stats AS (
      SELECT
        DATE(created_at) as signup_date,
        COUNT(*) as new_users_count
      FROM profiles
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(created_at)
    ),
    daily_active AS (
      SELECT
        DATE(last_activity_date) as activity_date,
        COUNT(DISTINCT user_id) as active_count
      FROM user_stats
      WHERE last_activity_date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(last_activity_date)
    )
    SELECT
      COALESCE(ds.signup_date, da.activity_date) as period_date,
      COALESCE(ds.new_users_count, 0)::BIGINT as new_users,
      (SELECT COUNT(*) FROM profiles WHERE created_at <= COALESCE(ds.signup_date, da.activity_date))::BIGINT as cumulative_users,
      COALESCE(da.active_count, 0)::BIGINT as active_users,
      CASE
        WHEN COALESCE(ds.new_users_count, 0) > 0
        THEN (COALESCE(da.active_count, 0)::NUMERIC / COALESCE(ds.new_users_count, 1)::NUMERIC * 100)
        ELSE 0
      END as retention_rate
    FROM daily_stats ds
    FULL OUTER JOIN daily_active da ON ds.signup_date = da.activity_date
    ORDER BY period_date DESC;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get detailed user progress analytics (REAL DATA FROM PROFILES)
CREATE OR REPLACE FUNCTION get_user_progress_analytics()
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  full_name TEXT,
  country_name TEXT,
  total_xp INTEGER,
  current_level INTEGER,
  completed_courses TEXT[],
  current_streak INTEGER,
  longest_streak INTEGER,
  total_study_time INTEGER,
  last_activity_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  course_completion_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id as user_id,
    p.email,
    p.full_name,
    c.name as country_name,
    COALESCE(us.total_xp, 0) as total_xp,
    COALESCE(us.level, 1) as current_level,
    COALESCE(us.completed_courses, ARRAY[]::TEXT[]) as completed_courses,
    COALESCE(us.current_streak, 0) as current_streak,
    COALESCE(us.longest_streak, 0) as longest_streak,
    COALESCE(us.total_study_time, 0) as total_study_time,
    us.last_activity_date,
    p.created_at,
    CASE
      WHEN us.completed_courses IS NOT NULL AND array_length(us.completed_courses, 1) > 0
      THEN (array_length(us.completed_courses, 1)::NUMERIC / 12::NUMERIC * 100) -- Assuming 12 total courses
      ELSE 0
    END as course_completion_rate
  FROM profiles p
  LEFT JOIN countries c ON p.country_id = c.id
  LEFT JOIN user_stats us ON p.id = us.user_id
  ORDER BY us.total_xp DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql;

-- Function to get course completion analytics for all 12 courses
CREATE OR REPLACE FUNCTION get_course_completion_analytics()
RETURNS TABLE (
  course_id TEXT,
  course_name TEXT,
  total_enrollments BIGINT,
  total_completions BIGINT,
  completion_rate NUMERIC,
  avg_completion_time NUMERIC,
  total_xp_awarded BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH all_courses AS (
    -- Define all 12 courses with their proper names
    SELECT 'foundation' as id, 'Foundation Course' as name
    UNION ALL SELECT 'defi-fundamentals', 'DeFi Fundamentals'
    UNION ALL SELECT 'degen', 'Degen Trading'
    UNION ALL SELECT 'nft-creation', 'NFT Creation'
    UNION ALL SELECT 'content-creation', 'Content Creation'
    UNION ALL SELECT 'advanced-trading', 'Advanced Trading'
    UNION ALL SELECT 'development', 'Blockchain Development'
    UNION ALL SELECT 'web3-security', 'Web3 Security'
    UNION ALL SELECT 'dao-governance', 'DAO Governance'
    UNION ALL SELECT 'web3-gaming', 'Web3 Gaming'
    UNION ALL SELECT 'crypto-tax', 'Crypto Tax & Legal'
    UNION ALL SELECT 'web3-social', 'Web3 Social'
  ),
  course_progress AS (
    -- Get all course progress data
    SELECT
      cp.course_id,
      cp.user_id,
      cp.progress_percentage,
      cp.completed_at,
      CASE WHEN cp.progress_percentage = 100 THEN 1 ELSE 0 END as is_completed
    FROM course_progress cp
  ),
  completed_courses_from_stats AS (
    -- Also get completed courses from user_stats table
    SELECT
      unnest(us.completed_courses) as course_id,
      us.user_id,
      100 as progress_percentage,
      us.updated_at as completed_at,
      1 as is_completed
    FROM user_stats us
    WHERE us.completed_courses IS NOT NULL AND array_length(us.completed_courses, 1) > 0
  ),
  combined_progress AS (
    -- Combine both sources and deduplicate
    SELECT DISTINCT course_id, user_id, progress_percentage, completed_at, is_completed
    FROM (
      SELECT * FROM course_progress
      UNION ALL
      SELECT * FROM completed_courses_from_stats
    ) combined
  ),
  course_stats AS (
    SELECT
      ac.id as course_id,
      ac.name as course_name,
      COUNT(DISTINCT cp.user_id) as total_enrollments,
      COUNT(DISTINCT CASE WHEN cp.is_completed = 1 THEN cp.user_id END) as total_completions,
      CASE
        WHEN COUNT(DISTINCT cp.user_id) > 0
        THEN (COUNT(DISTINCT CASE WHEN cp.is_completed = 1 THEN cp.user_id END)::NUMERIC / COUNT(DISTINCT cp.user_id)::NUMERIC) * 100
        ELSE 0
      END as completion_rate
    FROM all_courses ac
    LEFT JOIN combined_progress cp ON ac.id = cp.course_id
    GROUP BY ac.id, ac.name
  )
  SELECT
    cs.course_id,
    cs.course_name,
    COALESCE(cs.total_enrollments, 0)::BIGINT as total_enrollments,
    COALESCE(cs.total_completions, 0)::BIGINT as total_completions,
    ROUND(cs.completion_rate, 1) as completion_rate,
    0.0 as avg_completion_time, -- Would need session tracking
    (cs.total_completions * 500)::BIGINT as total_xp_awarded -- Estimated XP
  FROM course_stats cs
  ORDER BY cs.total_completions DESC, cs.course_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get geographic user distribution (NO REVENUE/BOOKINGS)
CREATE OR REPLACE FUNCTION get_enhanced_user_country_stats()
RETURNS TABLE (
  country_name TEXT,
  country_code TEXT,
  flag_emoji TEXT,
  user_count BIGINT,
  active_users BIGINT,
  avg_xp NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.name as country_name,
    c.code as country_code,
    c.flag_emoji,
    COUNT(p.id)::BIGINT as user_count,
    COUNT(CASE WHEN us.last_activity_date >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END)::BIGINT as active_users,
    COALESCE(AVG(us.total_xp), 0)::NUMERIC as avg_xp
  FROM countries c
  LEFT JOIN profiles p ON c.id = p.country_id
  LEFT JOIN user_stats us ON p.id = us.user_id
  GROUP BY c.name, c.code, c.flag_emoji
  HAVING COUNT(p.id) > 0
  ORDER BY user_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get user activity timeline (NO BOOKINGS)
CREATE OR REPLACE FUNCTION get_user_activity_timeline(target_user_id UUID)
RETURNS TABLE (
  activity_date DATE,
  activity_type TEXT,
  activity_description TEXT,
  xp_earned INTEGER,
  course_id TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    DATE(us.updated_at) as activity_date,
    'course_progress' as activity_type,
    'Course progress updated' as activity_description,
    COALESCE(us.total_xp, 0) as xp_earned,
    NULL::TEXT as course_id
  FROM user_stats us
  WHERE us.user_id = target_user_id
    AND us.updated_at >= CURRENT_DATE - INTERVAL '90 days'

  UNION ALL

  SELECT
    DATE(p.created_at) as activity_date,
    'registration' as activity_type,
    'User registered' as activity_description,
    0 as xp_earned,
    NULL::TEXT as course_id
  FROM profiles p
  WHERE p.id = target_user_id
    AND p.created_at >= CURRENT_DATE - INTERVAL '90 days'

  ORDER BY activity_date DESC;
END;
$$ LANGUAGE plpgsql;
