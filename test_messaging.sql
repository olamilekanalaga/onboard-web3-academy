-- Test Messaging System
-- Run this in Supabase SQL Editor to test the messaging functionality

-- First, let's see what users exist in the system
SELECT id, email FROM auth.users LIMIT 5;

-- Check if profiles exist
SELECT id, first_name, last_name FROM profiles LIMIT 5;

-- Test the conversation_list view structure
SELECT * FROM conversation_list LIMIT 1;

-- Check direct_messages table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'direct_messages' 
ORDER BY ordinal_position;

-- Test inserting a sample message (replace UUIDs with actual user IDs)
-- You'll need to replace these UUIDs with actual user IDs from your system
/*
INSERT INTO direct_messages (sender_id, receiver_id, message) 
VALUES (
  'your-sender-user-id-here',
  'your-receiver-user-id-here', 
  'Test message from SQL'
);
*/

-- Test the conversation view after inserting messages
-- SELECT * FROM conversation_list;

-- Check if RLS is working properly
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  cmd, 
  qual 
FROM pg_policies 
WHERE tablename IN ('direct_messages', 'notifications', 'profiles');

-- Test notifications table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'notifications' 
ORDER BY ordinal_position;
