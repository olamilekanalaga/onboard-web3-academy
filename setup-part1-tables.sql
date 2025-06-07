-- PART 1: Create Tables and Insert Data
-- Copy and paste this entire block into Supabase SQL Editor and click RUN

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

-- Update profiles table to include country
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS country_id INTEGER REFERENCES countries(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS timezone VARCHAR(50);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- Session types table
CREATE TABLE IF NOT EXISTS session_types (
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
('Project Consultation', 'Get help with your Web3 project or startup', 60, 180.00)
ON CONFLICT DO NOTHING;

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'admin',
  permissions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table (available time slots)
CREATE TABLE IF NOT EXISTS sessions (
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
CREATE TABLE IF NOT EXISTS bookings (
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
