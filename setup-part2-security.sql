-- PART 2: Security Policies and Functions
-- Copy and paste this entire block into Supabase SQL Editor and click RUN

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_sessions_available ON sessions(is_available);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id ON user_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_event_type ON user_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_user_analytics_created_at ON user_analytics(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Countries are publicly readable" ON countries;
DROP POLICY IF EXISTS "Session types are publicly readable" ON session_types;
DROP POLICY IF EXISTS "Admin users can view admin users" ON admin_users;
DROP POLICY IF EXISTS "Available sessions are publicly readable" ON sessions;
DROP POLICY IF EXISTS "Admins can manage sessions" ON sessions;
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can manage all bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create their own analytics" ON user_analytics;
DROP POLICY IF EXISTS "Admins can view all analytics" ON user_analytics;

-- Countries: Public read access
CREATE POLICY "Countries are publicly readable" ON countries FOR SELECT USING (true);

-- Session types: Public read access
CREATE POLICY "Session types are publicly readable" ON session_types FOR SELECT USING (true);

-- Admin users: Only accessible by admins
CREATE POLICY "Admin users can view admin users" ON admin_users FOR SELECT USING (
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
);

-- Sessions: Public read for available sessions, admin full access
CREATE POLICY "Available sessions are publicly readable" ON sessions FOR SELECT USING (is_available = true);
CREATE POLICY "Admins can manage sessions" ON sessions FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
);

-- Bookings: Users can see their own bookings, admins can see all
CREATE POLICY "Users can view their own bookings" ON bookings FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create their own bookings" ON bookings FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own bookings" ON bookings FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admins can manage all bookings" ON bookings FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
);

-- User analytics: Users can create their own analytics, admins can view all
CREATE POLICY "Users can create their own analytics" ON user_analytics FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can view all analytics" ON user_analytics FOR SELECT USING (
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid() AND is_active = true)
);

-- Functions for analytics
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

-- Function to get booking statistics
CREATE OR REPLACE FUNCTION get_booking_stats()
RETURNS TABLE (
  total_bookings BIGINT,
  pending_bookings BIGINT,
  confirmed_bookings BIGINT,
  completed_bookings BIGINT,
  cancelled_bookings BIGINT,
  total_revenue DECIMAL(10,2),
  avg_rating DECIMAL(3,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_bookings,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_bookings,
    COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed_bookings,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_bookings,
    COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_bookings,
    COALESCE(SUM(payment_amount) FILTER (WHERE payment_status = 'completed'), 0) as total_revenue,
    ROUND(AVG(feedback_rating) FILTER (WHERE feedback_rating IS NOT NULL), 2) as avg_rating
  FROM bookings;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
