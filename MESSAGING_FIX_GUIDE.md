# Messaging System Fix Guide

## Issues Fixed

### 1. Database Schema Issues
- **Problem**: Code was using `recipient_id` but database uses `receiver_id`
- **Problem**: Code was using `content` field but database uses `message` field
- **Problem**: Code was referencing profile fields that don't exist (`username`, `display_name`)
- **Solution**: Updated all components to use correct field names

### 2. Missing Database Tables
- **Problem**: `direct_messages` table didn't exist
- **Solution**: Created the table with proper structure and RLS policies

### 3. Conversation List Issues
- **Problem**: Trying to load from non-existent `conversations` table
- **Solution**: Created `conversation_list` view that aggregates latest messages

## Database Setup Required

Run these SQL commands in your Supabase SQL Editor:

```sql
-- 1. Create direct_messages table (if not exists)
CREATE TABLE IF NOT EXISTS direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create indexes
CREATE INDEX IF NOT EXISTS idx_direct_messages_sender ON direct_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_direct_messages_receiver ON direct_messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_direct_messages_created_at ON direct_messages(created_at);

-- 3. Enable RLS and create policies
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own messages" ON direct_messages
FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON direct_messages
FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can delete their own messages" ON direct_messages
FOR DELETE USING (auth.uid() = sender_id);

-- 4. Create conversation list view
CREATE OR REPLACE VIEW conversation_list AS
WITH latest_messages AS (
  SELECT 
    CASE WHEN sender_id < receiver_id THEN sender_id ELSE receiver_id END as user1_id,
    CASE WHEN sender_id < receiver_id THEN receiver_id ELSE sender_id END as user2_id,
    sender_id, receiver_id, message, created_at,
    ROW_NUMBER() OVER (
      PARTITION BY 
        CASE WHEN sender_id < receiver_id THEN sender_id ELSE receiver_id END,
        CASE WHEN sender_id < receiver_id THEN receiver_id ELSE sender_id END
      ORDER BY created_at DESC
    ) as rn
  FROM direct_messages
)
SELECT 
  lm.user1_id, lm.user2_id, lm.sender_id, lm.receiver_id,
  lm.message as last_message, lm.created_at as last_message_at,
  COALESCE(p1.first_name || ' ' || p1.last_name, p1.first_name, 'User') as user1_name,
  p1.avatar_url as user1_avatar,
  COALESCE(p2.first_name || ' ' || p2.last_name, p2.first_name, 'User') as user2_name,
  p2.avatar_url as user2_avatar
FROM latest_messages lm
LEFT JOIN profiles p1 ON p1.id = lm.user1_id
LEFT JOIN profiles p2 ON p2.id = lm.user2_id
WHERE lm.rn = 1;
```

## Code Changes Made

### 1. DirectMessageModal.tsx
- Fixed database field names (`message` instead of `content`, `receiver_id` instead of `recipient_id`)
- Updated profile field references (`first_name`, `last_name` instead of `username`, `display_name`)
- Added better error logging
- Fixed notification creation to match existing notifications table structure

### 2. ConversationList.tsx
- Updated to use `conversation_list` view instead of non-existent table
- Fixed data transformation to work with actual database structure
- Added debugging logs

### 3. Chat.tsx
- Fixed profile field references
- Updated notification creation

## Testing Steps

1. **Run the SQL setup** in your Supabase SQL Editor
2. **Test message sending**:
   - Go to Social/Messages
   - Try sending a message to another user
   - Check browser console for any errors
3. **Test message receiving**:
   - Have another user send you a message
   - Check if it appears in your conversation list
   - Check if you can open and view the conversation
4. **Test notifications**:
   - Send/receive messages
   - Check if notifications are created properly

## Debugging

If issues persist:

1. **Check browser console** for error messages
2. **Run test queries** using `test_messaging.sql`
3. **Verify user profiles** exist with proper `first_name`/`last_name` fields
4. **Check RLS policies** are not blocking access

## Common Issues

1. **Empty conversation list**: Usually means no messages have been sent yet
2. **Messages not showing**: Check if RLS policies are properly configured
3. **Profile names not showing**: Verify profiles table has `first_name` and `last_name` fields
4. **Real-time not working**: Check if Supabase real-time is enabled for the `direct_messages` table

The messaging system should now work properly after running the SQL setup!
