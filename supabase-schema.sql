-- Session Booking System Database Schema

-- Countries table for user registration
CREATE TABLE countries (
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
('South Africa', 'ZA', '🇿🇦', 'Africa/Johannesburg');

-- Update profiles table to include country
ALTER TABLE profiles ADD COLUMN country_id INTEGER REFERENCES countries(id);
ALTER TABLE profiles ADD COLUMN timezone VARCHAR(50);
ALTER TABLE profiles ADD COLUMN phone VARCHAR(20);

-- Session types table
CREATE TABLE session_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  price_usd DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default session types
INSERT INTO session_types (name, description, duration_minutes, price_usd) VALUES
('1-on-1 Mentorship', 'Personal guidance on your Web3 journey', 60, 150.00),
('Portfolio Review', 'Get feedback on your crypto portfolio strategy', 45, 100.00),
('Career Coaching', 'Navigate your transition into Web3 careers', 60, 120.00),
('Technical Deep Dive', 'Advanced technical concepts and implementation', 90, 200.00),
('Project Consultation', 'Get help with your Web3 project or startup', 60, 180.00);

-- Admin users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'admin',
  permissions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table (available time slots)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_type_id INTEGER REFERENCES session_types(id),
  title VARCHAR(200),
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  timezone VARCHAR(50) NOT NULL,
  max_participants INTEGER DEFAULT 1,
  is_available BOOLEAN DEFAULT true,
  meeting_link VARCHAR(500),
  meeting_password VARCHAR(100),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending',
  booking_notes TEXT,
  user_timezone VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'pending',
  payment_amount DECIMAL(10,2),
  payment_currency VARCHAR(3) DEFAULT 'USD',
  payment_id VARCHAR(100),
  reminder_sent BOOLEAN DEFAULT false,
  feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
  feedback_comment TEXT,
  attended BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(session_id, user_id)
);

-- User analytics table
CREATE TABLE user_analytics (
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

-- Create indexes for better performance
CREATE INDEX idx_sessions_start_time ON sessions(start_time);
CREATE INDEX idx_sessions_available ON sessions(is_available);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);
CREATE INDEX idx_user_analytics_user_id ON user_analytics(user_id);
CREATE INDEX idx_user_analytics_event_type ON user_analytics(event_type);
CREATE INDEX idx_user_analytics_created_at ON user_analytics(created_at);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;

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
