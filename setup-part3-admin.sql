-- PART 3: Create Admin User
-- IMPORTANT: Replace 'your-email@example.com' with your actual email address
-- Copy and paste this into Supabase SQL Editor and click RUN

-- First, let's see all users in your system
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC;

-- Find your specific user (REPLACE 'your-email@example.com' with your actual email)
-- SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Add yourself as admin (REPLACE 'your-user-id-here' with your actual user ID from above)
-- INSERT INTO admin_users (user_id, role, is_active) 
-- VALUES ('your-user-id-here', 'admin', true);

-- Example: If your email is john@example.com and your user ID is 12345678-1234-1234-1234-123456789012
-- INSERT INTO admin_users (user_id, role, is_active) 
-- VALUES ('12345678-1234-1234-1234-123456789012', 'admin', true);

-- Verify admin user was created
-- SELECT au.*, u.email FROM admin_users au 
-- JOIN auth.users u ON au.user_id = u.id 
-- WHERE au.is_active = true;
